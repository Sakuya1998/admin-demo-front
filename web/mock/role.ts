import { MockMethod } from 'vite-plugin-mock'

const roles = [
  { id: 1, name: 'admin', desc: 'SUPER ADMIN', status: 1, created_at: '2023-01-01' },
  { id: 2, name: 'user', desc: 'NORMAL USER', status: 1, created_at: '2023-01-02' },
  { id: 3, name: 'guest', desc: 'GUEST', status: 0, created_at: '2023-01-03' },
]

export default [
  {
    url: '/api/roles',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, page_size = 10, name = '' } = query
      
      let filtered = roles
      if (name) {
        filtered = filtered.filter(r => r.name.includes(name))
      }
      
      const start = (page - 1) * page_size
      const end = start + parseInt(page_size)
      const pagedList = filtered.slice(start, end)
      
      return {
        code: 200,
        data: {
          items: pagedList,
          total: filtered.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/roles',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/roles/:id',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/roles/:id',
    method: 'delete',
    response: ({ query, url }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = roles.findIndex(r => r.id === id)
      if (index !== -1) {
        roles.splice(index, 1)
      }
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/roles/:id/menus',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        data: [1, 2, 3], // Mock menu IDs
        msg: 'success',
      }
    },
  },
  {
    url: '/api/roles/:id/menus',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
