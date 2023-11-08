import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
import { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { addPending, removePending } from './request-abort'

const whiteList: string[] = []

interface Error {
  code: number
  data?:
    | any[]
    | boolean
    | number
    | number
    | { [key: string]: any }
    | null
    | string
  message: string
  [property: string]: any
}
interface Response {
  error?: null | Error
  jsonrpc: string
  result: any
  [property: string]: any
}
/**
 * @param {object} response
 */
export function handleResponse(response: AxiosResponse<Response>) {
  const { data, config } = response
  removePending(config, whiteList)
  if (data.error) {
    if (!config.hideError) {
      ElMessage.closeAll()
      ElMessage.error(data.error.message || 'Something Error')
    }

    return Promise.reject(data.error)
  } else if (!data.result) {
    // ElMessage.closeAll()
    // ElMessage.error('Error Fetching Data')
    return Promise.reject('Error Fetching Data')
  } else {
    return data.result
  }
}

/**
 * @param {object} config
 */
export function handleRequest(config: InternalAxiosRequestConfig) {
  // do something before request is sent
  config = addPending(config, whiteList)
  // config.data && (config.data['id'] = 1)
  return config
}

/**
 * @param {object} error
 * @param {boolean} showMessage
 */
export function handleError(error: any, showMessage: boolean) {
  // do something with request error
  if (
    error.message &&
    showMessage &&
    error.name !== 'CanceledError' &&
    !error.config.hideError
  ) {
    ElMessage.closeAll()
    ElMessage({
      message: error.message,
      type: 'error',
      showClose: true
    })
  }
  return Promise.reject(error)
}
