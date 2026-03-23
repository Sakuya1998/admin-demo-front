<template>
  <div class="user-container">
    <a-card class="search-card">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item name="username">
          <a-input v-model:value="searchForm.username" :placeholder="t('common.search') + '/' + t('user.nickname')" allow-clear />
        </a-form-item>
        <a-form-item name="status">
          <a-select v-model:value="searchForm.status" :placeholder="t('common.status')" style="width: 120px" allow-clear>
            <a-select-option :value="1">{{ t('common.active') }}</a-select-option>
            <a-select-option :value="0">{{ t('common.inactive') }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">{{ t('common.search') }}</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">{{ t('common.reset') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :title="t('system.userMgmt')">
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
        :data-source="userList"
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
              <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(record.id)">
                <a style="color: var(--color-error)">{{ t('common.delete') }}</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

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
        <a-form-item :label="t('user.username')" name="username">
          <a-input v-model:value="modalForm.username" :disabled="modalType === 'edit'" />
        </a-form-item>
        <a-form-item :label="t('user.nickname')" name="nickname">
          <a-input v-model:value="modalForm.nickname" />
        </a-form-item>
        <a-form-item :label="t('user.password')" name="password" v-if="modalType === 'add'">
          <a-input-password v-model:value="modalForm.password" />
        </a-form-item>
        <a-form-item :label="t('user.email')" name="email">
          <a-input v-model:value="modalForm.email" />
        </a-form-item>
        <a-form-item :label="t('common.status')" name="status">
          <a-radio-group v-model:value="modalForm.status">
            <a-radio :value="1">{{ t('common.active') }}</a-radio>
            <a-radio :value="0">{{ t('common.inactive') }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getUsers, createUser, updateUser, deleteUser, type User } from '@/api/user'

const { t } = useI18n()
const loading = ref(false)
const userList = ref<User[]>([])
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
    await Promise.all(state.selectedRowKeys.map(id => deleteUser(id)))
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
  username: '',
  status: undefined,
})

const columns = computed(() => [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: t('user.username'), dataIndex: 'username', key: 'username' },
  { title: t('user.nickname'), dataIndex: 'nickname', key: 'nickname' },
  { title: t('user.email'), dataIndex: 'email', key: 'email' },
  { title: t('common.status'), dataIndex: 'status', key: 'status' },
  { title: t('common.createdAt'), dataIndex: 'created_at', key: 'created_at' },
  { title: t('common.action'), key: 'action', width: 150 },
])

// Modal
const modalVisible = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const modalLoading = ref(false)
const modalFormRef = ref()
const modalForm = reactive({
  id: 0,
  username: '',
  nickname: '',
  password: '',
  email: '',
  status: 1,
})
const modalRules = computed(() => ({
  username: [{ required: true, message: t('common.required') }],
  nickname: [{ required: true, message: t('common.required') }],
  password: [{ required: true, message: t('common.required') }],
}))

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getUsers({
      page: pagination.current,
      page_size: pagination.pageSize,
      ...searchForm,
    })
    // Mock data if API returns empty or fails (for demo purposes)
    if (res.data && res.data.items) {
      userList.value = res.data.items
      pagination.total = res.data.total
    } else {
       // Fallback mock data for visualization
       userList.value = [
         { id: 1, username: 'admin', nickname: 'ADMINISTRATOR', email: 'admin@cyber.net', phone: '', status: 1, created_at: '2077-01-01', roles: [] },
         { id: 2, username: 'operator', nickname: 'OPERATOR 01', email: 'op1@cyber.net', phone: '', status: 1, created_at: '2077-01-02', roles: [] },
         { id: 3, username: 'guest', nickname: 'GUEST USER', email: 'guest@cyber.net', phone: '', status: 0, created_at: '2077-01-03', roles: [] },
       ]
       pagination.total = 3
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
  searchForm.username = ''
  searchForm.status = undefined
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
  modalForm.username = ''
  modalForm.nickname = ''
  modalForm.password = ''
  modalForm.email = ''
  modalForm.status = 1
  modalVisible.value = true
}

const handleEdit = (record: User) => {
  modalType.value = 'edit'
  modalForm.id = record.id
  modalForm.username = record.username
  modalForm.nickname = record.nickname
  modalForm.email = record.email
  modalForm.status = record.status
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await deleteUser(id)
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
      await createUser(modalForm)
      message.success(t('common.success'))
    } else {
      await updateUser(modalForm.id, modalForm)
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

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.user-container {
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
