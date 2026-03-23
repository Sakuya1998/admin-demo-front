import request from '@/utils/request'

export interface Role {
  id: number
  name: string
  desc: string
  status: number
  created_at: string
}

export interface RoleParams {
  page?: number
  page_size?: number
  name?: string
  status?: number
}

export const getRoles = (params: RoleParams) => {
  return request({
    url: '/roles',
    method: 'get',
    params,
  })
}

export const getRole = (id: number) => {
  return request({
    url: `/roles/${id}`,
    method: 'get',
  })
}

export const createRole = (data: any) => {
  return request({
    url: '/roles',
    method: 'post',
    data,
  })
}

export const updateRole = (id: number, data: any) => {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data,
  })
}

export const deleteRole = (id: number) => {
  return request({
    url: `/roles/${id}`,
    method: 'delete',
  })
}

export const getRoleMenus = (id: number) => {
  return request({
    url: `/roles/${id}/menus`,
    method: 'get',
  })
}

export const setRoleMenus = (id: number, menu_ids: number[]) => {
  return request({
    url: `/roles/${id}/menus`,
    method: 'put',
    data: { menu_ids },
  })
}
