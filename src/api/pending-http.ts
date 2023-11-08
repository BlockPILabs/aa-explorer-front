import axios, { InternalAxiosRequestConfig } from 'axios'

const httpStore = new Map()
let whiteList: any[] = []

let service: any = null
let router: any = null

function addPending(config: InternalAxiosRequestConfig) {
  const key = getKey(config)
  if (whiteList.includes(config.url)) return

  let cancelToken
  if (config.cancelToken) {
    cancelToken = config.cancelToken
  } else {
    cancelToken = new axios.CancelToken((cancel) => {
      httpStore.set(key, cancel)
    })
  }

  config.cancelToken = cancelToken

  const prevCancel = httpStore.get(key)
  if (prevCancel) {
    prevCancel()
    httpStore.delete(key)
  }

  httpStore.set(key, cancelToken)
}

function removePending(config: InternalAxiosRequestConfig) {
  const key = getKey(config)
  if (whiteList.includes(config.url)) return

  const cancelToken = httpStore.get(key)
  if (cancelToken) {
    httpStore.delete(key)
  }
}

function clearPending() {
  httpStore.forEach((cancel) => {
    cancel()
  })
  httpStore.clear()
}

function getKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config
  const formatParam = params
    ? typeof params === 'object'
      ? JSON.stringify(params)
      : params
    : ''
  const formatData = data
    ? typeof data === 'object'
      ? JSON.stringify(data)
      : data
    : ''
  return `${method}${url}${formatParam}${formatData}`
}

function init(option: any) {
  service = option.service
  router = option.router
  whiteList = option.whiteList
  if (!service) {
    throw Error('Need axios Instance')
  }

  service.interceptors.request.use(addPending)
  service.interceptors.response.use(removePending)

  router && router.beforeEach(clearPending)
}

export { init }

export default service
