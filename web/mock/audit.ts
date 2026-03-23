import { MockMethod } from 'vite-plugin-mock'

const operations = [
  { id: 1, username: 'admin', module: 'User', action: 'Create', method: 'POST', ip: '127.0.0.1', status: 200, created_at: '2026-03-05 10:00:00' },
  { id: 2, username: 'admin', module: 'Role', action: 'Update', method: 'PUT', ip: '127.0.0.1', status: 200, created_at: '2026-03-05 11:00:00' },
]

const logins = [
  { id: 1, username: 'admin', ip: '127.0.0.1', location: 'Local', browser: 'Chrome', os: 'Windows', status: 1, created_at: '2026-03-05 09:00:00' },
  { id: 2, username: 'user', ip: '192.168.1.1', location: 'LAN', browser: 'Firefox', os: 'Linux', status: 1, created_at: '2026-03-05 09:30:00' },
]

const onlineUsers = [
  { id: 'sess_1', username: 'admin', ip: '127.0.0.1', browser: 'Chrome', login_time: '2026-03-05 09:00:00' },
]

export default [
  {
    url: '/api/audit/operations',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: operations,
          total: operations.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/audit/logins',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: logins,
          total: logins.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/audit/online-users',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: onlineUsers,
          total: onlineUsers.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/audit/online-users/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = url.split('/').pop()
      const index = onlineUsers.findIndex(u => u.id === id)
      if (index !== -1) {
        onlineUsers.splice(index, 1)
      }
      return { code: 200, msg: 'success' }
    }
  },
] as MockMethod[]
