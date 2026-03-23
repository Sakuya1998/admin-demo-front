<template>
  <div class="group-container">
    <a-card :title="t('system.groupMgmt')">
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
        :data-source="list" 
        :loading="loading" 
        row-key="id"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? t('common.active') : t('common.inactive') }}
            </a-tag>
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
    >
      <a-form :model="modalForm" layout="vertical">
        <a-form-item :label="t('group.name')" name="name">
          <a-input v-model:value="modalForm.name" />
        </a-form-item>
        <a-form-item :label="t('group.desc')" name="desc">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getGroups, createGroup, updateGroup, deleteGroup } from '@/api/group'

const { t } = useI18n()
const loading = ref(false)
const list = ref([])
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
    await Promise.all(state.selectedRowKeys.map(id => deleteGroup(id)))
    message.success(`${t('common.delete')} ${state.selectedRowKeys.length} ${t('common.items')}`)
    state.selectedRowKeys = []
    fetchData()
  } catch (error) {
    message.error(t('common.failed'))
    loading.value = false
  }
}
const modalVisible = ref(false)
const modalType = ref('add')
const modalLoading = ref(false)
const modalForm = reactive({ id: 0, name: '', desc: '', status: 1 })

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: t('group.name'), dataIndex: 'name', key: 'name' },
  { title: t('group.desc'), dataIndex: 'desc', key: 'desc' },
  { title: t('common.status'), dataIndex: 'status', key: 'status' },
  { title: t('common.action'), key: 'action' },
]

const fetchData = async () => {
  loading.value = true
  const res: any = await getGroups({})
  list.value = res.data.items
  loading.value = false
}

const handleAdd = () => {
  modalType.value = 'add'
  modalForm.id = 0
  modalForm.name = ''
  modalForm.desc = ''
  modalForm.status = 1
  modalVisible.value = true
}

const handleEdit = (record: any) => {
  modalType.value = 'edit'
  Object.assign(modalForm, record)
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  await deleteGroup(id)
  message.success(t('common.success'))
  fetchData()
}

const handleModalOk = async () => {
  modalLoading.value = true
  try {
    if (modalType.value === 'add') {
      await createGroup(modalForm)
    } else {
      await updateGroup(modalForm.id, modalForm)
    }
    message.success(t('common.success'))
    modalVisible.value = false
    fetchData()
  } finally {
    modalLoading.value = false
  }
}

onMounted(fetchData)
</script>
