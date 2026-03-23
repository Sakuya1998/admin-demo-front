<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-msg">{{ t('error.notFound') }}</p>
      <a-button type="primary" @click="$router.push('/')">
        {{ t('error.back') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="less" scoped>
.error-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-bg-base);
  
  .error-content {
    text-align: center;
    
    .error-code {
      font-size: 120px;
      color: var(--color-error);
      margin: 0;
      text-shadow: 0 0 20px var(--color-error);
      animation: glitch 1s infinite;
    }
    
    .error-msg {
      font-size: 24px;
      color: var(--color-text-secondary);
      letter-spacing: 4px;
      margin-bottom: 40px;
    }
  }
}

@keyframes glitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 2px) }
  40% { transform: translate(-2px, -2px) }
  60% { transform: translate(2px, 2px) }
  80% { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
}
</style>
