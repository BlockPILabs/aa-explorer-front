import { http } from '@/api/request'
import { URL } from '@/api/urls'

export function getChains() {
  return http.get(URL.chains.list)
}

export function getExistChains(params) {
  return http.get(URL.chains.exist, { params })
}
