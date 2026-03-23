import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body
      if (username === 'admin' && password === 'admin') {
        return {
          code: 200,
          data: {
            token: 'admin-token',
          },
          msg: 'success',
        }
      } else {
        return {
          code: 200, // Return 200 but with error code to match request interceptor logic or use 401
          // My request.ts checks res.code !== 0 && res.code !== 200.
          // Let's use standard success structure.
          data: {
            token: 'admin-token', // Allow any login for demo
          },
          msg: 'success',
        }
      }
    },
  },
  {
    url: '/api/auth/user',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          username: 'ADMIN',
          roles: ['admin'],
          permissions: ['*:*:*'],
          avatar: '',
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
