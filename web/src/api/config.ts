import request from '@/utils/request'

export interface SysConfig {
  id: number
  key: string
  value: string
  desc: string
  is_public: boolean
  created_at: string
}

export const getConfigs = (params: any) => {
  return request({
    url: '/configs',
    method: 'get',
    params,
  })
}

export const createConfig = (data: any) => {
  return request({
    url: '/configs',
    method: 'post',
    data,
  })
}

export const updateConfig = (id: number, data: any) => {
  return request({
    url: `/configs/${id}`,
    method: 'put',
    data,
  })
}

export const deleteConfig = (id: number) => {
  return request({
    url: `/configs/${id}`,
    method: 'delete',
  })
}
