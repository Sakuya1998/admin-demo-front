import request from '@/utils/request'

export interface DictType {
  id: number
  name: string
  code: string
  remark: string
  status: number
  created_at: string
}

export interface DictData {
  id: number
  type_id: number
  label: string
  value: string
  sort: number
  status: number
  created_at: string
}

// Dict Type
export const getDictTypes = (params: any) => {
  return request({
    url: '/dicts/types',
    method: 'get',
    params,
  })
}

export const createDictType = (data: any) => {
  return request({
    url: '/dicts/types',
    method: 'post',
    data,
  })
}

export const updateDictType = (id: number, data: any) => {
  return request({
    url: `/dicts/types/${id}`,
    method: 'put',
    data,
  })
}

export const deleteDictType = (id: number) => {
  return request({
    url: `/dicts/types/${id}`,
    method: 'delete',
  })
}

// Dict Data
export const getDictData = (params: any) => {
  return request({
    url: '/dicts/data',
    method: 'get',
    params,
  })
}

export const createDictData = (data: any) => {
  return request({
    url: '/dicts/data',
    method: 'post',
    data,
  })
}

export const updateDictData = (id: number, data: any) => {
  return request({
    url: `/dicts/data/${id}`,
    method: 'put',
    data,
  })
}

export const deleteDictData = (id: number) => {
  return request({
    url: `/dicts/data/${id}`,
    method: 'delete',
  })
}
