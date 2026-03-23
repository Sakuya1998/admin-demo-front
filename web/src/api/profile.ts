import request from '@/utils/request'

export const getUserProfile = () => {
  return request({
    url: '/profile/me',
    method: 'get',
  })
}

export const updateUserProfile = (data: any) => {
  return request({
    url: '/profile/me',
    method: 'put',
    data,
  })
}

export const updatePassword = (data: any) => {
  return request({
    url: '/profile/password',
    method: 'post',
    data,
  })
}
