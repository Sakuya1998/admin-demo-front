import request from '@/utils/request'

export interface User {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  created_at: string
  roles: any[]
}

export interface UserParams {
  page?: number
  page_size?: number
  username?: string
  status?: number
}

export const getUsers = (params: UserParams) => {
  return request({
    url: '/users',
    method: 'get',
    params,
  })
}

export const getUser = (id: number) => {
  return request({
    url: `/users/${id}`,
    method: 'get',
  })
}

export const createUser = (data: any) => {
  return request({
    url: '/users',
    method: 'post',
    data,
  })
}

export const updateUser = (id: number, data: any) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data,
  })
}

export const deleteUser = (id: number) => {
  return request({
    url: `/users/${id}`,
    method: 'delete',
  })
}
