<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="system-logo">A</div>
        <h1 class="system-title">{{ t('system.title') }} <span class="version">v2.0</span></h1>
        <p class="system-subtitle">{{ t('system.subtitle') }}</p>
      </div>
      
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="login-form"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: t('common.required') }]"
        >
          <a-input v-model:value="formState.username" :placeholder="t('login.username')">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: t('common.required') }]"
        >
          <a-input-password v-model:value="formState.password" :placeholder="t('login.password')">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large">
            {{ t('login.submit') }}
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="login-footer">
        <span>{{ t('login.status') }}: <span style="color: var(--color-success)">{{ t('system.status.optimal') }}</span></span>
        <span>{{ t('login.encryption') }}: <span style="color: var(--color-primary)">AES-256</span></span>
      </div>
    </div>
    
    <div class="bg-grid"></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const { t } = useI18n();
const loading = ref(false);
const userStore = useUserStore();

const formState = reactive({
  username: '',
  password: '',
});

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    const success = await userStore.login(values);
    if (success) {
      message.success(t('login.success'));
      router.push('/dashboard');
    } else {
      message.error(t('login.failed'));
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
  message.error(t('login.failed'));
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-bg-base);
  position: relative;
  overflow: hidden;
  
  .bg-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 0;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, transparent 0%, var(--color-bg-base) 80%);
    }
  }
  
  .login-box {
    width: 400px;
    background: rgba(10, 10, 10, 0.9);
    border: 1px solid var(--color-border);
    padding: 40px;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
    
    // Chamfered corners visual
    &::before {
      content: '';
      position: absolute;
      top: -2px; left: -2px;
      width: 20px; height: 20px;
      border-top: 2px solid var(--color-primary);
      border-left: 2px solid var(--color-primary);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px; right: -2px;
      width: 20px; height: 20px;
      border-bottom: 2px solid var(--color-primary);
      border-right: 2px solid var(--color-primary);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 40px;
      
      .system-logo {
        font-size: 48px;
        color: var(--color-primary);
        font-family: var(--font-family-mono);
        text-shadow: 0 0 10px var(--color-primary);
        margin-bottom: 10px;
      }
      
      .system-title {
        color: var(--color-text-base);
        font-size: 24px;
        letter-spacing: 2px;
        margin: 0;
        
        .version {
          font-size: 12px;
          color: var(--color-secondary);
          vertical-align: super;
        }
      }
      
      .system-subtitle {
        color: var(--color-text-secondary);
        font-size: 12px;
        letter-spacing: 4px;
        margin-top: 5px;
      }
    }
    
    .login-form {
      .ant-form-item {
        margin-bottom: 24px;
      }
      
      .ant-btn {
        height: 48px;
        font-size: 16px;
        margin-top: 20px;
      }
    }
    
    .login-footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #333;
      padding-top: 15px;
      font-size: 10px;
      font-family: var(--font-family-mono);
      color: #666;
    }
  }
}
</style>
