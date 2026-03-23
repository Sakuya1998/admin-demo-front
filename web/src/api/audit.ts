import request from '@/utils/request'

export const getOperations = (params: any) => {
  return request({
    url: '/audit/operations',
    method: 'get',
    params,
  })
}

export const getLogins = (params: any) => {
  return request({
    url: '/audit/logins',
    method: 'get',
    params,
  })
}

export const getOnlineUsers = (params: any) => {
  return request({
    url: '/audit/online-users',
    method: 'get',
    params,
  })
}

export const forceLogout = (id: string) => {
  return request({
    url: `/audit/online-users/${id}`,
    method: 'delete',
  })
}
