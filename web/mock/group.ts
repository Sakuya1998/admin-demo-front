import { MockMethod } from 'vite-plugin-mock'

const groups = [
  { id: 1, name: 'Dev Team', desc: 'Development', status: 1, created_at: '2026-01-01' },
  { id: 2, name: 'Test Team', desc: 'Testing', status: 1, created_at: '2026-01-02' },
]

export default [
  {
    url: '/api/groups',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, page_size = 10, name = '' } = query
      
      let filtered = groups
      if (name) {
        filtered = filtered.filter(g => g.name.includes(name))
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
    url: '/api/groups',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/groups/:id',
    method: 'put',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/groups/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = groups.findIndex(g => g.id === id)
      if (index !== -1) {
        groups.splice(index, 1)
      }
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
