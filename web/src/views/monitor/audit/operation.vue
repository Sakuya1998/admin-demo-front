<template>
  <div class="audit-container">
    <a-card :title="t('audit.operation')">
      <template #extra>
        <a-button type="link" @click="fetchData">{{ t('common.refresh') }}</a-button>
      </template>
      <a-table :columns="columns" :data-source="list" :loading="loading" row-key="id" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOperations } from '@/api/audit'

const { t } = useI18n()
const loading = ref(false)
const list = ref([])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: t('audit.username'), dataIndex: 'username', key: 'username' },
  { title: t('audit.module'), dataIndex: 'module', key: 'module' },
  { title: t('audit.action'), dataIndex: 'action', key: 'action' },
  { title: t('audit.method'), dataIndex: 'method', key: 'method' },
  { title: t('audit.ip'), dataIndex: 'ip', key: 'ip' },
  { title: t('audit.status'), dataIndex: 'status', key: 'status' },
  { title: t('common.createdAt'), dataIndex: 'created_at', key: 'created_at' },
]

const fetchData = async () => {
  loading.value = true
  const res: any = await getOperations({})
  list.value = res.data.items
  loading.value = false
}

onMounted(fetchData)
</script>
