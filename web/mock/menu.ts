import { MockMethod } from 'vite-plugin-mock'

const menus = [
  { id: 1, parent_id: 0, name: 'Dashboard', title: 'system.dashboard', path: '/dashboard', component: 'dashboard/index', icon: 'dashboard', sort: 1, type: 2, status: 1 },
  { id: 2, parent_id: 0, name: 'System', title: 'system.management', path: '/system', component: 'Layout', icon: 'setting', sort: 2, type: 1, status: 1, children: [
    { id: 3, parent_id: 2, name: 'Users', title: 'system.userMgmt', path: '/system/users', component: 'system/user/index', icon: '', sort: 1, type: 2, status: 1 },
    { id: 4, parent_id: 2, name: 'Roles', title: 'system.roleMgmt', path: '/system/roles', component: 'system/role/index', icon: '', sort: 2, type: 2, status: 1 },
    { id: 10, parent_id: 2, name: 'Groups', title: 'system.groupMgmt', path: '/system/groups', component: 'system/group/index', icon: '', sort: 2, type: 2, status: 1 },
    { id: 5, parent_id: 2, name: 'Menus', title: 'system.menuMgmt', path: '/system/menus', component: 'system/menu/index', icon: '', sort: 3, type: 2, status: 1 },
    { id: 6, parent_id: 2, name: 'Permissions', title: 'system.permMgmt', path: '/system/permissions', component: 'system/permission/index', icon: '', sort: 4, type: 2, status: 1 },
    { id: 7, parent_id: 2, name: 'Dicts', title: 'system.dictMgmt', path: '/system/dicts', component: 'system/dict/index', icon: '', sort: 5, type: 2, status: 1 },
    { id: 8, parent_id: 2, name: 'Configs', title: 'system.sysConfig', path: '/system/configs', component: 'system/config/index', icon: '', sort: 6, type: 2, status: 1 },
    { id: 9, parent_id: 2, name: 'Files', title: 'system.fileMgmt', path: '/system/files', component: 'system/file/index', icon: '', sort: 7, type: 2, status: 1 },
  ]},
  { id: 11, parent_id: 0, name: 'Monitor', title: 'monitor.title', path: '/monitor', component: 'Layout', icon: 'fund', sort: 3, type: 1, status: 1, children: [
    { id: 17, parent_id: 11, name: 'Server', title: 'monitor.server', path: '/monitor/server', component: 'monitor/server/index', icon: '', sort: 1, type: 2, status: 1 },
  ]},
  { id: 12, parent_id: 0, name: 'Job', title: 'job.title', path: '/job', component: 'Layout', icon: 'calendar', sort: 4, type: 1, status: 1, children: [
    { id: 13, parent_id: 12, name: 'CronJob', title: 'job.job', path: '/job/cron', component: 'monitor/job/index', icon: '', sort: 1, type: 2, status: 1 },
  ]},
  { id: 14, parent_id: 0, name: 'Audit', title: 'audit.title', path: '/audit', component: 'Layout', icon: 'audit', sort: 5, type: 1, status: 1, children: [
    { id: 15, parent_id: 14, name: 'Log', title: 'audit.log', path: '/audit/log', component: 'Layout', icon: '', sort: 1, type: 1, status: 1, children: [
      { id: 16, parent_id: 15, name: 'Operation', title: 'audit.operation', path: '/audit/log/operation', component: 'monitor/audit/operation', icon: '', sort: 1, type: 2, status: 1 },
      { id: 17, parent_id: 15, name: 'Login', title: 'audit.login', path: '/audit/log/login', component: 'monitor/audit/login', icon: '', sort: 2, type: 2, status: 1 },
    ]},
    { id: 18, parent_id: 14, name: 'Session', title: 'audit.session', path: '/audit/session', component: 'Layout', icon: '', sort: 2, type: 1, status: 1, children: [
      { id: 19, parent_id: 18, name: 'Online', title: 'audit.online', path: '/audit/session/online', component: 'monitor/audit/online', icon: '', sort: 1, type: 2, status: 1 },
    ]},
  ]},
  { id: 20, parent_id: 0, name: 'Notice', title: 'notice.title', path: '/notice', component: 'Layout', icon: 'bell', sort: 6, type: 1, status: 1, children: [
    { id: 21, parent_id: 20, name: 'Message', title: 'notice.message', path: '/notice/message', component: 'notice/index', icon: '', sort: 1, type: 2, status: 1 },
    { id: 22, parent_id: 20, name: 'Manage', title: 'notice.manage', path: '/notice/manage', component: 'notice/manage', icon: '', sort: 2, type: 2, status: 1 },
  ]},
  { id: 23, parent_id: 0, name: 'Profile', title: 'profile.title', path: '/profile', component: 'profile/index', icon: 'user', sort: 7, type: 2, status: 1, hidden: true },
]

export default [
  {
    url: '/api/menus',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        data: menus,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/menus/tree',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        data: menus,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/menus',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/menus/:id',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/menus/:id',
    method: 'delete',
    response: ({ query }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
