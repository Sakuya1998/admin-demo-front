<template>
  <div class="notice-container">
    <a-card :title="t('notice.manage')">
      <template #extra>
        <a-button type="primary" @click="handleAdd">{{ t('common.create') }}</a-button>
      </template>
      <a-table :columns="columns" :data-source="list" :loading="loading" row-key="id">
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
        <a-form-item :label="t('notice.title')" name="title" :rules="[{ required: true, message: t('common.required') }]">
          <a-input v-model:value="modalForm.title" />
        </a-form-item>
        <a-form-item :label="t('notice.content')" name="content">
          <a-textarea v-model:value="modalForm.content" :rows="4" />
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
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/api/notice'

const { t } = useI18n()
const loading = ref(false)
const list = ref([])

const modalVisible = ref(false)
const modalType = ref('add')
const modalLoading = ref(false)
const modalForm = reactive({ id: 0, title: '', content: '', type: 'system', status: 1 })

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: t('notice.title', '标题'), dataIndex: 'title', key: 'title' },
  { title: t('notice.content', '内容'), dataIndex: 'content', key: 'content', ellipsis: true },
  { title: t('common.status'), dataIndex: 'status', key: 'status', width: 100 },
  { title: t('common.createdAt'), dataIndex: 'created_at', key: 'created_at', width: 180 },
  { title: t('common.action'), key: 'action', width: 150 },
]

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getTemplates({})
    list.value = res.data.items
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  modalType.value = 'add'
  modalForm.id = 0
  modalForm.title = ''
  modalForm.content = ''
  modalForm.type = 'system'
  modalForm.status = 1
  modalVisible.value = true
}

const handleEdit = (record: any) => {
  modalType.value = 'edit'
  Object.assign(modalForm, record)
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  await deleteTemplate(id)
  message.success(t('common.success'))
  fetchData()
}

const handleModalOk = async () => {
  if (!modalForm.title) {
    message.warning(t('common.required'))
    return
  }
  modalLoading.value = true
  try {
    if (modalType.value === 'add') {
      await createTemplate(modalForm)
    } else {
      await updateTemplate(modalForm.id, modalForm)
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
