import request from '@/utils/request'

export const getJobs = (params: any) => {
  return request({
    url: '/jobs',
    method: 'get',
    params,
  })
}

export const createJob = (data: any) => {
  return request({
    url: '/jobs',
    method: 'post',
    data,
  })
}

export const updateJob = (id: number, data: any) => {
  return request({
    url: `/jobs/${id}`,
    method: 'put',
    data,
  })
}

export const deleteJob = (id: number) => {
  return request({
    url: `/jobs/${id}`,
    method: 'delete',
  })
}

export const runJob = (id: number) => {
  return request({
    url: `/jobs/${id}/run`,
    method: 'post',
  })
}

export const pauseJob = (id: number) => {
  return request({
    url: `/jobs/${id}/pause`,
    method: 'post',
  })
}

export const resumeJob = (id: number) => {
  return request({
    url: `/jobs/${id}/resume`,
    method: 'post',
  })
}
