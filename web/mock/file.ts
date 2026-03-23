import { MockMethod } from 'vite-plugin-mock'

const files = [
  { id: 1, name: 'report_q1.pdf', size: '2.5MB', type: 'application/pdf', uploader: 'admin', created_at: '2023-03-01', url: '#' },
  { id: 2, name: 'logo.png', size: '500KB', type: 'image/png', uploader: 'user', created_at: '2023-03-02', url: '#' },
]

export default [
  {
    url: '/api/files',
    method: 'get',
    response: ({ query }: any) => {
      const { page = 1, page_size = 10 } = query
      return {
        code: 200,
        data: {
          items: files,
          total: files.length,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/files',
    method: 'post',
    response: ({ body }: any) => {
      return {
        code: 200,
        msg: 'success',
        data: {
          url: 'http://dummyimage.com/200x200',
        },
      }
    },
  },
] as MockMethod[]
