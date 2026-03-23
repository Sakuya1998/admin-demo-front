import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/health',
    method: 'get',
    response: () => {
      return {
        status: 'UP',
        details: {
          db: 'UP',
          redis: 'UP',
        },
      }
    },
  },
] as MockMethod[]
