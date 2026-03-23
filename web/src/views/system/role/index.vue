<template>
  <div class="role-container">
    <a-card class="search-card">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item name="name">
          <a-input v-model:value="searchForm.name" :placeholder="t('role.name')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">{{ t('common.search') }}</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">{{ t('common.reset') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :title="t('system.roleMgmt')">
      <template #extra>
        <a-space>
          <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleBatchDelete">
            <a-button :disabled="!hasSelected" danger>
              {{ t('common.batchDelete') }}
            </a-button>
          </a-popconfirm>
          <a-button type="primary" @click="handleAdd">{{ t('common.create') }}</a-button>
        </a-space>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="roleList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <span :style="{ color: record.status === 1 ? 'var(--color-success)' : 'var(--color-error)' }">
              {{ record.status === 1 ? t('common.active') : t('common.inactive') }}
            </span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">{{ t('common.edit') }}</a>
              <a @click="handlePermission(record)">{{ t('role.permissions') }}</a>
              <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(record.id)">
                <a style="color: var(--color-error)">{{ t('common.delete') }}</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalType === 'add' ? t('common.create') : t('common.edit')"
      @ok="handleModalOk"
      :confirmLoading="modalLoading"
      :okText="t('common.save')"
      :cancelText="t('common.cancel')"
    >
      <a-form
        ref="modalFormRef"
        :model="modalForm"
        :rules="modalRules"
        layout="vertical"
      >
        <a-form-item :label="t('role.name')" name="name">
          <a-input v-model:value="modalForm.name" />
        </a-form-item>
        <a-form-item :label="t('role.desc')" name="desc">
          <a-textarea v-model:value="modalForm.desc" />
        </a-form-item>
        <a-form-item :label="t('common.status')" name="status">
          <a-radio-group v-model:value="modalForm.status">
            <a-radio :value="1">{{ t('common.active') }}</a-radio>
            <a-radio :value="0">{{ t('common.inactive') }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Permission Modal -->
    <a-modal
      v-model:open="permVisible"
      :title="t('role.permissions')"
      @ok="handlePermOk"
      :confirmLoading="permLoading"
      :okText="t('common.save')"
      :cancelText="t('common.cancel')"
    >
      <a-tree
        v-if="treeData.length > 0"
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="treeData"
        :field-names="{ children: 'children', title: 'title', key: 'id' }"
        default-expand-all
      />
      <div v-else class="empty-tree">{{ t('common.noData') }}</div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getRoles, createRole, updateRole, deleteRole, setRoleMenus, type Role } from '@/api/role'
import { getMenuTree } from '@/api/menu'

const { t } = useI18n()
const loading = ref(false)
const roleList = ref<any[]>([])
const state = reactive({
  selectedRowKeys: [] as number[],
})
const hasSelected = computed(() => state.selectedRowKeys.length > 0)

const onSelectChange = (selectedRowKeys: number[]) => {
  state.selectedRowKeys = selectedRowKeys
}

const handleBatchDelete = async () => {
  if (!hasSelected.value) return
  
  try {
    loading.value = true
    await Promise.all(state.selectedRowKeys.map(id => deleteRole(id)))
    message.success(`${t('common.delete')} ${state.selectedRowKeys.length} ${t('common.items')}`)
    state.selectedRowKeys = []
    fetchData()
  } catch (error) {
    message.error(t('common.failed'))
    loading.value = false
  }
}
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
})

const searchForm = reactive({
  name: '',
})

const columns = computed(() => [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: t('role.name'), dataIndex: 'name', key: 'name' },
  { title: t('role.desc'), dataIndex: 'desc', key: 'desc' },
  { title: t('common.status'), dataIndex: 'status', key: 'status' },
  { title: t('common.createdAt'), dataIndex: 'created_at', key: 'created_at' },
  { title: t('common.action'), key: 'action', width: 250 },
])

// Modal
const modalVisible = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const modalLoading = ref(false)
const modalFormRef = ref()
const modalForm = reactive({
  id: 0,
  name: '',
  desc: '',
  status: 1,
})
const modalRules = computed(() => ({
  name: [{ required: true, message: t('common.required') }],
}))

// Permission
const permVisible = ref(false)
const permLoading = ref(false)
const currentRoleId = ref(0)
const checkedKeys = ref<number[]>([])
const treeData = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getRoles({
      page: pagination.current,
      page_size: pagination.pageSize,
      ...searchForm,
    })
    if (res.data && res.data.items) {
      roleList.value = res.data.items
      pagination.total = res.data.total
    } else {
      // Fallback mock data
      roleList.value = [
        { id: 1, name: 'admin', desc: 'SUPER ADMIN', status: 1, created_at: '2077-01-01' },
        { id: 2, name: 'editor', desc: 'CONTENT EDITOR', status: 1, created_at: '2077-01-02' },
      ]
      pagination.total = 2
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.name = ''
  handleSearch()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

const handleAdd = () => {
  modalType.value = 'add'
  modalForm.id = 0
  modalForm.name = ''
  modalForm.desc = ''
  modalForm.status = 1
  modalVisible.value = true
}

const handleEdit = (record: Role) => {
  modalType.value = 'edit'
  modalForm.id = record.id
  modalForm.name = record.name
  modalForm.desc = record.desc
  modalForm.status = record.status
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await deleteRole(id)
    message.success(t('common.success'))
    fetchData()
  } catch (error) {
    message.error(t('common.failed'))
  }
}

const handleModalOk = async () => {
  try {
    await modalFormRef.value.validate()
    modalLoading.value = true
    if (modalType.value === 'add') {
      await createRole(modalForm)
      message.success(t('common.success'))
    } else {
      await updateRole(modalForm.id, modalForm)
      message.success(t('common.success'))
    }
    modalVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  } finally {
    modalLoading.value = false
  }
}

const handlePermission = async (record: Role) => {
  currentRoleId.value = record.id
  permVisible.value = true
  
  // Load menu tree
  try {
    const res: any = await getMenuTree()
    if (res.data) {
      treeData.value = res.data
    } else {
      // Mock tree data
      treeData.value = [
        { id: 1, title: 'SYSTEM', children: [
          { id: 2, title: 'USER MGMT' },
          { id: 3, title: 'ROLE MGMT' },
          { id: 4, title: 'MENU MGMT' }
        ]}
      ] as any
    }
    
    // Load current role permissions
    // const permRes: any = await getRoleMenus(record.id)
    // if (permRes.data) checkedKeys.value = permRes.data
    checkedKeys.value = [2, 3] // Mock checked
  } catch (error) {
    console.error(error)
  }
}

const handlePermOk = async () => {
  permLoading.value = true
  try {
    await setRoleMenus(currentRoleId.value, checkedKeys.value)
    message.success(t('common.success'))
    permVisible.value = false
  } catch (error) {
    message.error(t('common.failed'))
  } finally {
    permLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.role-container {
  .search-card {
    margin-bottom: 16px;
  }
  
  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .title {
        font-family: var(--font-family-mono);
        font-size: 18px;
        color: var(--color-primary);
        letter-spacing: 1px;
      }
    }
  }
}
</style>
