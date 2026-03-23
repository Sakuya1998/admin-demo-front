<template>
  <div class="config-container">
    <a-card :title="t('system.sysConfig')">
      <template #extra>
        <a-button type="primary" @click="handleAdd">{{ t('common.create') }}</a-button>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="configList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'is_public'">
            <span :style="{ color: record.is_public ? 'var(--color-success)' : 'var(--color-warning)' }">
              {{ record.is_public ? t('config.public') : t('config.private') }}
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
        <a-form-item :label="t('config.key')" name="key">
          <a-input v-model:value="modalForm.key" :disabled="modalType === 'edit'" />
        </a-form-item>
        <a-form-item :label="t('config.value')" name="value">
          <a-textarea v-model:value="modalForm.value" />
        </a-form-item>
        <a-form-item :label="t('config.desc')" name="desc">
          <a-input v-model:value="modalForm.desc" />
        </a-form-item>
        <a-form-item :label="t('config.public')" name="is_public">
          <a-switch v-model:checked="modalForm.is_public" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getConfigs, createConfig, updateConfig, deleteConfig, type SysConfig } from '@/api/config'

const { t } = useI18n()
const loading = ref(false)
const configList = ref<SysConfig[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
})

const columns = computed(() => [
  { title: t('config.key'), dataIndex: 'key', key: 'key' },
  { title: t('config.value'), dataIndex: 'value', key: 'value', ellipsis: true },
  { title: t('config.desc'), dataIndex: 'desc', key: 'desc' },
  { title: t('common.status'), dataIndex: 'is_public', key: 'is_public', width: 100 },
  { title: t('common.action'), key: 'action', width: 150 },
])

// Modal
const modalVisible = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const modalLoading = ref(false)
const modalFormRef = ref()
const modalForm = reactive({
  id: 0,
  key: '',
  value: '',
  desc: '',
  is_public: false,
})
const modalRules = computed(() => ({
  key: [{ required: true, message: t('common.required') }],
  value: [{ required: true, message: t('common.required') }],
}))

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getConfigs({
      page: pagination.current,
      page_size: pagination.pageSize,
    })
    if (res.data && res.data.items) {
      configList.value = res.data.items
      pagination.total = res.data.total
    } else {
      // Mock
      configList.value = [
        { id: 1, key: 'site_name', value: 'Admin Demo', desc: 'Website Name', is_public: true, created_at: '' },
        { id: 2, key: 'upload_limit', value: '10MB', desc: 'Max Upload Size', is_public: true, created_at: '' },
        { id: 3, key: 'secret_key', value: '******', desc: 'API Secret', is_public: false, created_at: '' },
      ]
      pagination.total = 3
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchData()
}

const handleAdd = () => {
  modalType.value = 'add'
  modalForm.id = 0
  modalForm.key = ''
  modalForm.value = ''
  modalForm.desc = ''
  modalForm.is_public = false
  modalVisible.value = true
}

const handleEdit = (record: SysConfig) => {
  modalType.value = 'edit'
  Object.assign(modalForm, record)
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await deleteConfig(id)
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
      await createConfig(modalForm)
      message.success(t('common.success'))
    } else {
      await updateConfig(modalForm.id, modalForm)
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
.config-container {
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
