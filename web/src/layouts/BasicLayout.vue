<template>
  <a-layout class="layout-container">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="layout-sider"
      width="240"
    >
      <div class="logo">
        <span class="logo-icon">A</span>
        <span v-if="!collapsed" class="logo-text">{{ t('system.title') }}</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        class="layout-menu"
        @click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <dashboard-outlined />
          </template>
          <span>{{ t('system.dashboard') }}</span>
        </a-menu-item>
        <a-sub-menu key="system">
          <template #title>
            <span>
              <setting-outlined />
              <span>{{ t('system.management') }}</span>
            </span>
          </template>
          <a-menu-item key="users">{{ t('system.userMgmt') }}</a-menu-item>
          <a-menu-item key="roles">{{ t('system.roleMgmt') }}</a-menu-item>
          <a-menu-item key="groups">{{ t('system.groupMgmt') }}</a-menu-item>
          <a-menu-item key="menus">{{ t('system.menuMgmt') }}</a-menu-item>
          <a-menu-item key="permissions">{{ t('system.permMgmt') }}</a-menu-item>
          <a-menu-item key="dicts">{{ t('system.dictMgmt') }}</a-menu-item>
          <a-menu-item key="configs">{{ t('system.sysConfig') }}</a-menu-item>
          <a-menu-item key="files">{{ t('system.fileMgmt') }}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="monitor">
          <template #title>
            <span>
              <fund-outlined />
              <span>{{ t('monitor.title') }}</span>
            </span>
          </template>
          <a-menu-item key="server">{{ t('monitor.server') }}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="job">
          <template #title>
            <span>
              <calendar-outlined />
              <span>{{ t('job.title') }}</span>
            </span>
          </template>
          <a-menu-item key="job-cron">{{ t('job.job') }}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="audit">
          <template #title>
            <span>
              <audit-outlined />
              <span>{{ t('audit.title') }}</span>
            </span>
          </template>
          <a-sub-menu key="audit-log" :title="t('audit.log')">
            <a-menu-item key="audit-log-operation">{{ t('audit.operation') }}</a-menu-item>
            <a-menu-item key="audit-log-login">{{ t('audit.login') }}</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="audit-session" :title="t('audit.session')">
            <a-menu-item key="audit-session-online">{{ t('audit.online') }}</a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="notice">
          <template #title>
            <span>
              <bell-outlined />
              <span>{{ t('notice.title') }}</span>
            </span>
          </template>
          <a-menu-item key="notice-message">{{ t('notice.message') }}</a-menu-item>
          <a-menu-item key="notice-manage">{{ t('notice.manage') }}</a-menu-item>
        </a-sub-menu>
      </a-menu>
      
      <div class="sider-footer">
        <div class="system-status">
          <span>{{ t('system.status.cpu') }}</span>
          <a-progress :percent="45" :show-info="false" stroke-color="#00F0FF" trail-color="#333" size="small" />
        </div>
        <div class="system-status">
          <span>{{ t('system.status.mem') }}</span>
          <a-progress :percent="72" :show-info="false" stroke-color="#7000FF" trail-color="#333" size="small" />
        </div>
      </div>
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header class="layout-header">
        <div class="header-left">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <a-breadcrumb class="header-breadcrumb">
            <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
              {{ item.breadcrumbName }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="header-right">
          <span class="theme-switch" @click="toggleTheme">
            <bulb-filled v-if="themeStore.theme === 'dark'" />
            <bulb-outlined v-else />
          </span>
          <span class="locale-switch" @click="toggleLocale">
            <global-outlined />
            <span style="margin-left: 5px; font-size: 12px">{{ locale === 'zh-CN' ? 'CN' : 'EN' }}</span>
          </span>
          <span class="time-display">{{ currentTime }}</span>
          <div class="user-profile">
            <a-avatar size="small" style="background-color: #00F0FF; color: #000">A</a-avatar>
            <span class="username">{{ userStore.username }}</span>
          </div>
        </div>
      </a-layout-header>
      
      <TagsView />

      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TagsView from '@/components/TagsView/index.vue';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  GlobalOutlined,
  BulbOutlined,
  BulbFilled,
  FundOutlined,
  BellOutlined,
  CalendarOutlined,
  AuditOutlined,
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const themeStore = useThemeStore();
const userStore = useUserStore();

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title);
  const items = [];
  
  if (route.path.startsWith('/system')) {
    items.push({
      path: '/system',
      breadcrumbName: t('system.management')
    });
  } else {
     items.push({
      path: '/',
      breadcrumbName: t('system.title')
    });
  }
  
  matched.forEach((item) => {
    items.push({
      path: item.path,
      breadcrumbName: t(item.meta.title as string)
    });
  });
  
  return items;
});

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['dashboard']);
const currentTime = ref<string>(dayjs().format('HH:mm:ss'));
let timer: any;

const toggleLocale = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
};

const toggleTheme = () => {
  themeStore.toggleTheme();
};

const handleMenuClick = ({ key }: { key: string }) => {
  if (key === 'dashboard') {
    router.push('/dashboard');
  } else if (key === 'users') {
    router.push('/system/users');
  } else if (key === 'roles') {
    router.push('/system/roles');
  } else if (key === 'groups') {
    router.push('/system/groups');
  } else if (key === 'menus') {
    router.push('/system/menus');
  } else if (key === 'permissions') {
    router.push('/system/permissions');
  } else if (key === 'dicts') {
    router.push('/system/dicts');
  } else if (key === 'configs') {
    router.push('/system/configs');
  } else if (key === 'files') {
    router.push('/system/files');
  } else if (key === 'server') {
    router.push('/monitor/server');
  } else if (key === 'job-cron') {
    router.push('/job/cron');
  } else if (key === 'audit-log-operation') {
    router.push('/audit/log/operation');
  } else if (key === 'audit-log-login') {
    router.push('/audit/log/login');
  } else if (key === 'audit-session-online') {
    router.push('/audit/session/online');
  } else if (key === 'notice-message') {
    router.push('/notice/message');
  } else if (key === 'notice-manage') {
    router.push('/notice/manage');
  }
};

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/dashboard') {
      selectedKeys.value = ['dashboard'];
    } else if (newPath === '/system/users') {
      selectedKeys.value = ['users'];
    } else if (newPath === '/system/roles') {
      selectedKeys.value = ['roles'];
    } else if (newPath === '/system/groups') {
      selectedKeys.value = ['groups'];
    } else if (newPath === '/system/menus') {
      selectedKeys.value = ['menus'];
    } else if (newPath === '/system/permissions') {
      selectedKeys.value = ['permissions'];
    } else if (newPath === '/system/dicts') {
      selectedKeys.value = ['dicts'];
    } else if (newPath === '/system/configs') {
      selectedKeys.value = ['configs'];
    } else if (newPath === '/system/files') {
      selectedKeys.value = ['files'];
    } else if (newPath === '/monitor/server') {
      selectedKeys.value = ['server'];
    } else if (newPath === '/job/cron') {
      selectedKeys.value = ['job-cron'];
    } else if (newPath === '/audit/log/operation') {
      selectedKeys.value = ['audit-log-operation'];
    } else if (newPath === '/audit/log/login') {
      selectedKeys.value = ['audit-log-login'];
    } else if (newPath === '/audit/session/online') {
      selectedKeys.value = ['audit-session-online'];
    } else if (newPath === '/notice/message') {
      selectedKeys.value = ['notice-message'];
    } else if (newPath === '/notice/manage') {
      selectedKeys.value = ['notice-manage'];
    }
  },
  { immediate: true }
);

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = dayjs().format('HH:mm:ss');
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style lang="less" scoped>
.layout-container {
  height: 100vh;
  background: var(--color-bg-base);
}

.layout-sider {
  background: var(--color-bg-panel) !important;
  border-right: 1px solid var(--color-border);
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.5);
  z-index: 10;
  
  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 240, 255, 0.05);
    border-bottom: 1px solid var(--color-border);
    
    .logo-icon {
      font-size: 24px;
      font-weight: bold;
      color: var(--color-primary);
      text-shadow: var(--shadow-glow-primary);
      margin-right: 10px;
    }
    
    .logo-text {
      font-family: var(--font-family-mono);
      font-size: 18px;
      color: var(--color-text-base);
      letter-spacing: 2px;
    }
  }
  
  .sider-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    border-top: 1px solid #333;
    
    .system-status {
      margin-bottom: 10px;
      
      span {
        display: block;
        font-size: 10px;
        color: var(--color-text-secondary);
        margin-bottom: 2px;
        font-family: var(--font-family-mono);
      }
    }
  }
}

.layout-header {
  background: var(--color-bg-panel) !important;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #333;
  height: 64px;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .trigger {
      font-size: 18px;
      color: var(--color-primary);
      margin-right: 24px;
      cursor: pointer;
      transition: color 0.3s;
      
      &:hover {
        color: var(--color-text-base);
        text-shadow: var(--shadow-glow-primary);
      }
    }
    
    .header-breadcrumb {
      font-family: var(--font-family-mono);
      text-transform: uppercase;
      
      :deep(.ant-breadcrumb-link) {
        color: var(--color-text-secondary);
        &:hover {
          color: var(--color-primary);
        }
      }
      
      :deep(.ant-breadcrumb-separator) {
        color: var(--color-primary);
      }
      
      :deep(.ant-breadcrumb-item:last-child .ant-breadcrumb-link) {
        color: var(--color-primary);
        text-shadow: var(--shadow-glow-text);
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;

    .theme-switch {
      color: var(--color-primary);
      cursor: pointer;
      margin-right: 20px;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      
      &:hover {
        text-shadow: var(--shadow-glow-primary);
        transform: scale(1.1);
      }
    }

    .locale-switch {
      color: var(--color-primary);
      cursor: pointer;
      margin-right: 20px;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      
      &:hover {
        text-shadow: var(--shadow-glow-primary);
        transform: scale(1.1);
      }
    }
    
    .time-display {
      font-family: var(--font-family-mono);
      font-size: 16px;
      color: var(--color-primary);
      margin-right: 24px;
      letter-spacing: 2px;
      text-shadow: var(--shadow-glow-text);
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 5px 10px;
      border: 1px solid transparent;
      
      &:hover {
        border-color: var(--color-primary);
        background: rgba(0, 240, 255, 0.05);
      }
      
      .username {
        margin-left: 8px;
        font-family: var(--font-family-mono);
        color: var(--color-text-base);
      }
    }
  }
}

.layout-content {
  margin: 16px;
  background: transparent;
  overflow-y: auto;
  position: relative;
  
  // Grid background effect
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
}
</style>
