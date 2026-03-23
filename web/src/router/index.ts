import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'system.dashboard', affix: true }
      },
      {
        path: 'system/users',
        name: 'Users',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: 'system.userMgmt' }
      },
      {
        path: 'system/roles',
        name: 'Roles',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: 'system.roleMgmt' }
      },
      {
        path: 'system/menus',
        name: 'Menus',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: 'system.menuMgmt' }
      },
      {
        path: 'system/permissions',
        name: 'Permissions',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: 'system.permMgmt' }
      },
      {
        path: 'system/dicts',
        name: 'Dicts',
        component: () => import('@/views/system/dict/index.vue'),
        meta: { title: 'system.dictMgmt' }
      },
      {
        path: 'system/configs',
        name: 'Configs',
        component: () => import('@/views/system/config/index.vue'),
        meta: { title: 'system.sysConfig' }
      },
      {
        path: 'system/files',
        name: 'Files',
        component: () => import('@/views/system/file/index.vue'),
        meta: { title: 'system.fileMgmt' }
      },
      {
        path: 'system/groups',
        name: 'Groups',
        component: () => import('@/views/system/group/index.vue'),
        meta: { title: 'system.groupMgmt' }
      },
      {
        path: 'monitor/server',
        name: 'ServerMonitor',
        component: () => import('@/views/monitor/server/index.vue'),
        meta: { title: 'monitor.server' }
      },
      {
        path: 'job/cron',
        name: 'CronJob',
        component: () => import('@/views/monitor/job/index.vue'),
        meta: { title: 'job.job' }
      },
      {
        path: 'audit/log/operation',
        name: 'OperationAudit',
        component: () => import('@/views/monitor/audit/operation.vue'),
        meta: { title: 'audit.operation' }
      },
      {
        path: 'audit/log/login',
        name: 'LoginAudit',
        component: () => import('@/views/monitor/audit/login.vue'),
        meta: { title: 'audit.login' }
      },
      {
        path: 'audit/session/online',
        name: 'OnlineAudit',
        component: () => import('@/views/monitor/audit/online.vue'),
        meta: { title: 'audit.online' }
      },
      {
        path: 'notice/message',
        name: 'NoticeMessage',
        component: () => import('@/views/notice/index.vue'),
        meta: { title: 'notice.message' }
      },
      {
        path: 'notice/manage',
        name: 'NoticeManage',
        component: () => import('@/views/notice/manage.vue'),
        meta: { title: 'notice.manage' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: 'profile.title' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
