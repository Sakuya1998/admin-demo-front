import { MockMethod } from 'vite-plugin-mock'

const users = [
  { id: 1, username: 'admin', nickname: 'ADMIN', email: 'admin@example.com', status: 1, created_at: '2023-01-01', roles: ['admin'] },
  { id: 2, username: 'user', nickname: 'USER', email: 'user@example.com', status: 1, created_at: '2023-01-02', roles: ['user'] },
  { id: 3, username: 'guest', nickname: 'GUEST', email: 'guest@example.com', status: 0, created_at: '2023-01-03', roles: ['guest'] },
]

export default [
  {
    url: '/api/users',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, page_size = 10, username = '' } = query
      
      let filtered = users
      if (username) {
        filtered = filtered.filter(u => u.username.includes(username))
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
    url: '/api/users',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/users/:id',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/users/:id',
    method: 'delete',
    response: ({ query, url }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = users.findIndex(u => u.id === id)
      if (index !== -1) {
        users.splice(index, 1)
      }
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
