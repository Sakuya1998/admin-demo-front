import { MockMethod } from 'vite-plugin-mock'

const notifications = [
  { id: 1, title: 'Welcome', content: 'Welcome to the system', type: 'system', is_read: false, created_at: '2026-03-01 10:00:00' },
  { id: 2, title: 'Update', content: 'System update v2.0', type: 'system', is_read: true, created_at: '2026-02-28 09:00:00' },
]

const templates = [
  { id: 1, title: 'System Notice', content: 'We are updating the system...', type: 'system', status: 1, created_at: '2026-03-01 10:00:00' },
]

export default [
  {
    url: '/api/notification/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: notifications,
          total: notifications.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/notification/unread-count',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          count: notifications.filter(n => !n.is_read).length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/notification/read-all',
    method: 'put',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/notification/templates',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: templates,
          total: templates.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/notification/templates',
    method: 'post',
    response: ({ body }: any) => {
      const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
      templates.push({ id: newId, created_at: new Date().toISOString(), ...body });
      return { code: 200, msg: 'success' }
    }
  },
  {
    url: '/api/notification/templates/:id',
    method: 'put',
    response: ({ url, body }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = templates.findIndex(t => t.id === id)
      if (index !== -1) {
        templates[index] = { ...templates[index], ...body }
      }
      return { code: 200, msg: 'success' }
    }
  },
  {
    url: '/api/notification/templates/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = templates.findIndex(t => t.id === id)
      if (index !== -1) {
        templates.splice(index, 1)
      }
      return { code: 200, msg: 'success' }
    }
  },
] as MockMethod[]
