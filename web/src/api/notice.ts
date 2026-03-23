import request from '@/utils/request'

export const getNotifications = (params: any) => {
  return request({
    url: '/notification/list',
    method: 'get',
    params,
  })
}

export const getUnreadCount = () => {
  return request({
    url: '/notification/unread-count',
    method: 'get',
  })
}

export const markReadAll = () => {
  return request({
    url: '/notification/read-all',
    method: 'put',
  })
}

export const getTemplates = (params: any) => {
  return request({
    url: '/notification/templates',
    method: 'get',
    params,
  })
}

export const createTemplate = (data: any) => {
  return request({
    url: '/notification/templates',
    method: 'post',
    data,
  })
}

export const updateTemplate = (id: number, data: any) => {
  return request({
    url: `/notification/templates/${id}`,
    method: 'put',
    data,
  })
}

export const deleteTemplate = (id: number) => {
  return request({
    url: `/notification/templates/${id}`,
    method: 'delete',
  })
}
