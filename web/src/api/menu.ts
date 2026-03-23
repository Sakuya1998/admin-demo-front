import request from '@/utils/request'

export interface Menu {
  id: number
  parent_id: number
  name: string
  title: string
  path: string
  component: string
  icon: string
  sort: number
  type: number
  hidden: boolean
  status: number
  children?: Menu[]
}

export const getMenus = () => {
  return request({
    url: '/menus',
    method: 'get',
  })
}

export const getMenuTree = () => {
  return request({
    url: '/menus/tree',
    method: 'get',
  })
}

export const createMenu = (data: any) => {
  return request({
    url: '/menus',
    method: 'post',
    data,
  })
}

export const updateMenu = (id: number, data: any) => {
  return request({
    url: `/menus/${id}`,
    method: 'put',
    data,
  })
}

export const deleteMenu = (id: number) => {
  return request({
    url: `/menus/${id}`,
    method: 'delete',
  })
}
