<template>
  <div class="file-container">
    <a-card :title="t('system.fileMgmt')">
      <template #extra>
        <a-upload
          :show-upload-list="false"
          :customRequest="handleUpload"
        >
          <a-button type="primary" :loading="uploading">{{ t('common.upload') }}</a-button>
        </a-upload>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="fileList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'url'">
            <a :href="record.url" target="_blank" style="color: var(--color-primary)">{{ t('common.preview') }}</a>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getFiles, uploadFile, type FileInfo } from '@/api/file'

const { t } = useI18n()
const loading = ref(false)
const uploading = ref(false)
const fileList = ref<FileInfo[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
})

const columns = computed(() => [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: t('file.name'), dataIndex: 'name', key: 'name' },
  { title: t('file.size'), dataIndex: 'size', key: 'size' },
  { title: t('file.type'), dataIndex: 'type', key: 'type' },
  { title: t('file.uploader'), dataIndex: 'uploader', key: 'uploader' },
  { title: t('common.createdAt'), dataIndex: 'created_at', key: 'created_at' },
  { title: t('file.link'), key: 'url', width: 100 },
])

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getFiles({
      page: pagination.current,
      page_size: pagination.pageSize,
    })
    if (res.data && res.data.items) {
      fileList.value = res.data.items
      pagination.total = res.data.total
    } else {
      // Mock
      fileList.value = [
        { id: 1, name: 'report_2077.pdf', size: 1024000, type: 'application/pdf', uploader: 'admin', created_at: '2077-01-01', url: '#' },
        { id: 2, name: 'avatar.png', size: 20480, type: 'image/png', uploader: 'user1', created_at: '2077-01-02', url: '#' },
      ]
      pagination.total = 2
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

const handleUpload = async (options: any) => {
  const { file, onSuccess, onError } = options
  const formData = new FormData()
  formData.append('file', file)
  
  uploading.value = true
  try {
    await uploadFile(formData)
    message.success(t('common.success'))
    onSuccess()
    fetchData()
  } catch (error) {
    message.error(t('common.failed'))
    onError()
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.file-container {
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
