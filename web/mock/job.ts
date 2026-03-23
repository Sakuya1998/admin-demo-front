import { MockMethod } from 'vite-plugin-mock'

const jobs = [
  { id: 1, name: 'Daily Backup', cron: '0 0 0 * * ?', status: 1, next_run: '2026-03-07 00:00:00' },
  { id: 2, name: 'Log Clean', cron: '0 0 2 * * ?', status: 0, next_run: '2026-03-07 02:00:00' },
]

export default [
  {
    url: '/api/jobs',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, page_size = 10, name = '' } = query
      
      let filtered = jobs
      if (name) {
        filtered = filtered.filter(j => j.name.includes(name))
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
    url: '/api/jobs/:id/run',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/jobs/:id/pause',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/jobs/:id/resume',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/jobs',
    method: 'post',
    response: ({ body }: any) => {
      const newId = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
      jobs.push({ id: newId, next_run: '-', ...body });
      return { code: 200, msg: 'success' }
    }
  },
  {
    url: '/api/jobs/:id',
    method: 'put',
    response: ({ url, body }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = jobs.findIndex(j => j.id === id)
      if (index !== -1) {
        jobs[index] = { ...jobs[index], ...body }
      }
      return { code: 200, msg: 'success' }
    }
  },
  {
    url: '/api/jobs/:id',
    method: 'delete',
    response: ({ url }: any) => {
      const id = parseInt(url.split('/').pop())
      const index = jobs.findIndex(j => j.id === id)
      if (index !== -1) {
        jobs.splice(index, 1)
      }
      return { code: 200, msg: 'success' }
    }
  },
] as MockMethod[]
