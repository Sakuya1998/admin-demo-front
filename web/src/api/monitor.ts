import request from '@/utils/request'

export const getHealth = () => {
  return request({
    url: '/health',
    method: 'get',
  })
}
