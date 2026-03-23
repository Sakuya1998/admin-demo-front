<template>
  <div class="monitor-container">
    <a-card :title="t('monitor.server')">
      <template #extra>
        <a-button type="link" @click="fetchData">{{ t('common.refresh') }}</a-button>
      </template>
      <a-descriptions bordered>
        <a-descriptions-item label="DB">{{ status.details?.db }}</a-descriptions-item>
        <a-descriptions-item label="Redis">{{ status.details?.redis }}</a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-tag color="var(--color-success)">{{ status.status }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getHealth } from '@/api/monitor'

const { t } = useI18n()
const status = ref<any>({})

const fetchData = async () => {
  const res: any = await getHealth()
  status.value = res
}

onMounted(fetchData)
</script>
