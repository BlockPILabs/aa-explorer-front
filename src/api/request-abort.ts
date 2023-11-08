let pendings = new Map()

function _getKey(config: any) {
  const { url, method, params, data } = config
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

export const addPending = (
  config: any,
  whiteList: string[] = [],
  useFirstRequest: boolean = false
) => {
  if (whiteList.includes(config.url)) return
  const id = _getKey(config)
  const cancel = pendings.has(id)
  const Abort = new AbortController()
  config = { ...config, signal: Abort.signal }
  if (!cancel) {
    pendings.set(id, Abort)
  } else {
    if (useFirstRequest) {
      Abort.abort()
    } else {
      const AbortController = pendings.get(id)
      AbortController.abort()
      pendings.delete(id)
    }
  }

  return config
}
export const removePending = (config: any, whiteList: string[] = []) => {
  if (whiteList.includes(config.url)) return
  const id = _getKey(config)
  if (pendings.has(id)) {
    pendings.delete(id)
  }
}
export const clearPendings = () => {
  pendings.forEach((o: { abort: Function }) => {
    o.abort()
  })
  pendings.clear()
}
