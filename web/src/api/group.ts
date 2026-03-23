import request from '@/utils/request'

export const getGroups = (params: any) => {
  return request({
    url: '/groups',
    method: 'get',
    params,
  })
}

export const createGroup = (data: any) => {
  return request({
    url: '/groups',
    method: 'post',
    data,
  })
}

export const updateGroup = (id: number, data: any) => {
  return request({
    url: `/groups/${id}`,
    method: 'put',
    data,
  })
}

export const deleteGroup = (id: number) => {
  return request({
    url: `/groups/${id}`,
    method: 'delete',
  })
}
