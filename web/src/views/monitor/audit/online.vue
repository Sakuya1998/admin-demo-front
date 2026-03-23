<template>
  <div class="audit-container">
    <a-card :title="t('audit.online')">
      <template #extra>
        <a-button type="link" @click="fetchData">{{ t('common.refresh') }}</a-button>
      </template>
      <a-table :columns="columns" :data-source="list" :loading="loading" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleForceLogout(record.id)">
              <a style="color: var(--color-error)">{{ t('audit.forceLogout', '强制下线') }}</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { getOnlineUsers, forceLogout } from '@/api/audit'

const { t } = useI18n()
const loading = ref(false)
const list = ref([])

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: t('audit.username'), dataIndex: 'username', key: 'username' },
  { title: t('audit.ip'), dataIndex: 'ip', key: 'ip' },
  { title: t('audit.browser'), dataIndex: 'browser', key: 'browser' },
  { title: t('audit.loginTime'), dataIndex: 'login_time', key: 'login_time' },
  { title: t('common.action'), key: 'action', width: 120 },
]

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getOnlineUsers({})
    list.value = res.data.items
  } finally {
    loading.value = false
  }
}

const handleForceLogout = async (id: string) => {
  await forceLogout(id)
  message.success(t('common.success'))
  fetchData()
}

onMounted(fetchData)
</script>
