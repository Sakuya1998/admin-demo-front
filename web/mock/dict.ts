import { MockMethod } from 'vite-plugin-mock'

const dictTypes = [
  { id: 1, name: 'User Status', code: 'user_status', remark: 'User account status' },
  { id: 2, name: 'Menu Type', code: 'menu_type', remark: 'Menu type definition' },
]

const dictData = [
  { id: 1, type_id: 1, label: 'Active', value: '1', sort: 1, status: 1 },
  { id: 2, type_id: 1, label: 'Inactive', value: '0', sort: 2, status: 1 },
  { id: 3, type_id: 2, label: 'Directory', value: '1', sort: 1, status: 1 },
  { id: 4, type_id: 2, label: 'Menu', value: '2', sort: 2, status: 1 },
  { id: 5, type_id: 2, label: 'Button', value: '3', sort: 3, status: 1 },
]

export default [
  {
    url: '/api/dicts/types',
    method: 'get',
    response: ({ query }: any) => {
      return {
        code: 200,
        data: dictTypes,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/types',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/types/:id',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/types/:id',
    method: 'delete',
    response: ({ query }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/data',
    method: 'get',
    response: ({ query }: any) => {
      const { type_id } = query
      const data = type_id ? dictData.filter(d => d.type_id == type_id) : dictData
      return {
        code: 200,
        data: data,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/data',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/data/:id',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/dicts/data/:id',
    method: 'delete',
    response: ({ query }: any) => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
