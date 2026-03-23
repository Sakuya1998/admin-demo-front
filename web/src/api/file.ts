import request from '@/utils/request'

export interface FileInfo {
  id: number
  name: string
  size: number
  type: string
  url: string
  created_at: string
  uploader: string
}

export const getFiles = (params: any) => {
  return request({
    url: '/files',
    method: 'get',
    params,
  })
}

export const uploadFile = (formData: FormData) => {
  return request({
    url: '/files',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
