import { MockMethod } from 'vite-plugin-mock'

const policies = [
  { sub: 'role:admin', obj: '/api/users', act: 'GET' },
  { sub: 'role:admin', obj: '/api/users', act: 'POST' },
  { sub: 'role:admin', obj: '/api/users/:id', act: 'PUT' },
  { sub: 'role:admin', obj: '/api/users/:id', act: 'DELETE' },
]

export default [
  {
    url: '/api/policies',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        data: policies,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/policies',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/policies',
    method: 'delete',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/policies/reload',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
