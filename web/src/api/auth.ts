import request from '@/utils/request'

export const login = (data: any) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}

export const getUserInfo = () => {
  return request({
    url: '/auth/user',
    method: 'get',
  })
}
