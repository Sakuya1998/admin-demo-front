import { MockMethod } from 'vite-plugin-mock'

const userProfile = {
  id: 1,
  username: 'admin',
  nickname: 'Administrator',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  status: 1,
  roles: [
    { id: 1, name: 'admin', desc: 'Administrator', status: 1 }
  ],
  groups: [
    { id: 1, name: 'Dev Team', desc: 'Development Team', status: 1 }
  ],
  last_login_at: '2026-02-28T10:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2026-02-28T10:00:00Z'
}

export default [
  {
    url: '/api/profile/me',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: userProfile,
        msg: 'success',
      }
    },
  },
  {
    url: '/api/profile/me',
    method: 'put',
    response: ({ body }: any) => {
      return {
        code: 200,
        data: { ...userProfile, ...body },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/profile/password',
    method: 'post',
    response: () => {
      return {
        code: 200,
        msg: 'success',
      }
    },
  },
] as MockMethod[]
