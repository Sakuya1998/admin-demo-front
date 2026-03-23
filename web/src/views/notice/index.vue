<template>
  <div class="notice-container">
    <a-card :title="t('notice.message')">
      <template #extra>
        <a-button type="link" @click="fetchData">{{ t('common.refresh') }}</a-button>
      </template>
      <a-list :data-source="list" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :title="item.title" :description="item.content" />
            <div class="meta-info">
              <a-tag :color="item.is_read ? 'default' : 'red'">
                {{ item.is_read ? t('common.read') : t('common.unread') }}
              </a-tag>
              <span>{{ item.created_at }}</span>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getNotifications } from '@/api/notice'

const { t } = useI18n()
const loading = ref(false)
const list = ref([])

const fetchData = async () => {
  loading.value = true
  const res: any = await getNotifications({})
  list.value = res.data.items
  loading.value = false
}

onMounted(fetchData)
</script>
