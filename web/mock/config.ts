import { MockMethod } from 'vite-plugin-mock'

const configs = [
  { id: 1, key: 'site.title', value: 'Admin Demo', desc: 'Website Title', is_public: true },
  { id: 2, key: 'site.copyright', value: '© 2026 Admin Demo', desc: 'Copyright Info', is_public: true },
  { id: 3, key: 'sys.api_timeout', value: '30000', desc: 'API Timeout (ms)', is_public: false },
]

export default [
  {
    url: '/api/configs',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, page_size = 10 } = query
      return {
        code: 200,
        data: {
          items: configs,
          total: configs.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/configs',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/configs/:id',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/configs/:id',
    method: 'delete',
    response: ({ query }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
