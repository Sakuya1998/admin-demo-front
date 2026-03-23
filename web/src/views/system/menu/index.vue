<template>
  <div class="menu-container">
    <a-card :title="t('system.menuMgmt')">
      <template #extra>
        <a-button type="primary" @click="handleAdd(0)">{{ t('menu.root') }}</a-button>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="menuList"
        :loading="loading"
        row-key="id"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="record.type === 1 ? 'blue' : (record.type === 2 ? 'green' : 'orange')">
              {{ record.type === 1 ? t('menu.dir') : (record.type === 2 ? t('menu.menu') : t('menu.btn')) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <span :style="{ color: record.status === 1 ? 'var(--color-success)' : 'var(--color-error)' }">
              {{ record.status === 1 ? t('common.active') : t('common.inactive') }}
            </span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleAdd(record.id)" v-if="record.type !== 3">{{ t('menu.addSub') }}</a>
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
        <a-form-item :label="t('menu.parent')" name="parent_id">
          <a-input-number v-model:value="modalForm.parent_id" disabled style="width: 100%" />
        </a-form-item>
        <a-form-item :label="t('menu.type')" name="type">
          <a-radio-group v-model:value="modalForm.type">
            <a-radio :value="1">{{ t('menu.dir') }}</a-radio>
            <a-radio :value="2">{{ t('menu.menu') }}</a-radio>
            <a-radio :value="3">{{ t('menu.btn') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="t('menu.title')" name="title">
          <a-input v-model:value="modalForm.title" />
        </a-form-item>
        <a-form-item :label="t('menu.name')" name="name" v-if="modalForm.type !== 3">
          <a-input v-model:value="modalForm.name" />
        </a-form-item>
        <a-form-item :label="t('menu.path')" name="path" v-if="modalForm.type !== 3">
          <a-input v-model:value="modalForm.path" />
        </a-form-item>
        <a-form-item :label="t('menu.component')" name="component" v-if="modalForm.type === 2">
          <a-input v-model:value="modalForm.component" />
        </a-form-item>
        <a-form-item :label="t('menu.icon')" name="icon" v-if="modalForm.type !== 3">
          <a-input v-model:value="modalForm.icon" />
        </a-form-item>
        <a-form-item :label="t('menu.sort')" name="sort">
          <a-input-number v-model:value="modalForm.sort" style="width: 100%" />
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
import { getMenuTree, createMenu, updateMenu, deleteMenu, type Menu } from '@/api/menu'

const { t } = useI18n()
const loading = ref(false)
const menuList = ref<Menu[]>([])

const columns = computed(() => [
  { title: t('menu.title'), dataIndex: 'title', key: 'title' },
  { title: t('menu.icon'), dataIndex: 'icon', key: 'icon' },
  { title: t('menu.type'), dataIndex: 'type', key: 'type', width: 100 },
  { title: t('menu.path'), dataIndex: 'path', key: 'path' },
  { title: t('menu.sort'), dataIndex: 'sort', key: 'sort', width: 80 },
  { title: t('common.status'), dataIndex: 'status', key: 'status', width: 100 },
  { title: t('common.action'), key: 'action', width: 250 },
])

// Modal
const modalVisible = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const modalLoading = ref(false)
const modalFormRef = ref()
const modalForm = reactive({
  id: 0,
  parent_id: 0,
  name: '',
  title: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  type: 1,
  hidden: false,
  status: 1,
})
const modalRules = computed(() => ({
  title: [{ required: true, message: t('common.required') }],
  type: [{ required: true, message: t('common.required') }],
}))

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getMenuTree()
    if (res.data) {
      menuList.value = res.data
    } else {
      // Mock data
      menuList.value = [
        { 
          id: 1, parent_id: 0, name: 'system', title: 'SYSTEM', path: '/system', component: 'Layout', icon: 'setting', sort: 1, type: 1, hidden: false, status: 1,
          children: [
            { id: 2, parent_id: 1, name: 'users', title: 'USER MGMT', path: '/system/users', component: 'system/user/index', icon: 'user', sort: 1, type: 2, hidden: false, status: 1, children: [] },
            { id: 3, parent_id: 1, name: 'roles', title: 'ROLE MGMT', path: '/system/roles', component: 'system/role/index', icon: 'team', sort: 2, type: 2, hidden: false, status: 1, children: [] },
            { id: 4, parent_id: 1, name: 'menus', title: 'MENU MGMT', path: '/system/menus', component: 'system/menu/index', icon: 'menu', sort: 3, type: 2, hidden: false, status: 1, children: [] },
          ]
        }
      ] as any
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = (parentId: number) => {
  modalType.value = 'add'
  modalForm.id = 0
  modalForm.parent_id = parentId
  modalForm.name = ''
  modalForm.title = ''
  modalForm.path = ''
  modalForm.component = ''
  modalForm.icon = ''
  modalForm.sort = 0
  modalForm.type = 1 // Default to Directory
  modalForm.status = 1
  modalVisible.value = true
}

const handleEdit = (record: Menu) => {
  modalType.value = 'edit'
  Object.assign(modalForm, record)
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await deleteMenu(id)
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
      await createMenu(modalForm)
      message.success(t('common.success'))
    } else {
      await updateMenu(modalForm.id, modalForm)
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
.menu-container {
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
