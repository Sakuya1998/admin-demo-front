<template>
  <div class="audit-container">
    <a-card :title="t('audit.login')">
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
import { getLogins } from '@/api/audit'

const { t } = useI18n()
const loading = ref(false)
const list = ref([])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: t('audit.username'), dataIndex: 'username', key: 'username' },
  { title: t('audit.ip'), dataIndex: 'ip', key: 'ip' },
  { title: t('audit.location'), dataIndex: 'location', key: 'location' },
  { title: t('audit.browser'), dataIndex: 'browser', key: 'browser' },
  { title: t('audit.os'), dataIndex: 'os', key: 'os' },
  { title: t('common.createdAt'), dataIndex: 'created_at', key: 'created_at' },
]

const fetchData = async () => {
  loading.value = true
  const res: any = await getLogins({})
  list.value = res.data.items
  loading.value = false
}

onMounted(fetchData)
</script>
