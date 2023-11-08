import axios, { AxiosRequestConfig } from 'axios'
import router from '@/router'
import { clearPendings } from './request-abort'

import {
  handleResponse,
  handleError,
  handleRequest
} from './handle-interceptors'

const service = axios.create({
  baseURL:
    import.meta.env.VITE_APP_SERVER_HOST + import.meta.env.VITE_APP_BASE_API,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// request interceptor
service.interceptors.request.use((config) => handleRequest(config))

service.interceptors.response.use(
  (response) => handleResponse(response),
  (error) => handleError(error, true)
)

router.beforeEach((to, from) => {
  if (to.name !== from.name) {
    clearPendings()
  }
})

export default service
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }
}
