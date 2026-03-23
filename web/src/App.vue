<template>
  <a-config-provider
    :theme="{
      algorithm: currentAlgorithm,
      token: {
        colorPrimary: currentToken.colorPrimary,
        colorBgBase: currentToken.colorBgBase,
        colorBgContainer: currentToken.colorBgContainer,
        colorText: currentToken.colorText,
        borderRadius: 0,
        fontFamily: `'Orbitron', 'Rajdhani', 'JetBrains Mono', monospace`,
      }
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const currentAlgorithm = computed(() => {
  return themeStore.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
})

const currentToken = computed(() => {
  if (themeStore.theme === 'dark') {
    return {
      colorPrimary: '#00F0FF',
      colorBgBase: '#050505',
      colorBgContainer: '#0A0A0A',
      colorText: '#E0E0E0',
    }
  } else {
    return {
      colorPrimary: '#1677FF',
      colorBgBase: '#FFFFFF',
      colorBgContainer: '#F0F2F5',
      colorText: '#000000',
    }
  }
})
</script>

<style lang="less">
// Global styles are imported in main.ts
</style>
