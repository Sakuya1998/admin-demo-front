import request from '@/utils/request'

export interface Policy {
  sub: string
  obj: string
  act: string
}

export const getPolicies = () => {
  return request({
    url: '/policies',
    method: 'get',
  })
}

export const addPolicy = (data: Policy) => {
  return request({
    url: '/policies',
    method: 'post',
    data,
  })
}

export const deletePolicy = (data: Policy) => {
  return request({
    url: '/policies',
    method: 'delete',
    data,
  })
}

export const reloadPolicies = () => {
  return request({
    url: '/policies/reload',
    method: 'post',
  })
}
