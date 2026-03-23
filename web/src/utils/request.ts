import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import i18n from '@/i18n'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// Request interceptor
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // Assuming standard response format { code: 0, data: ..., msg: ... }
    if (res.code !== 0 && res.code !== 200) {
      message.error(res.msg || i18n.global.t('error.system'))
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  (error: any) => {
    message.error(error.message || i18n.global.t('error.network'))
    return Promise.reject(error)
  }
)

export default service
