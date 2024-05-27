import { http } from '@/api/request'
import { URL } from '@/api/urls'

export function getOverview(net, params) {
  return http.get(URL.monitor.overview(net), {
    params
  })
}

export function addMonitor(net, params) {
  return http.post(URL.monitor.addMonitor(net), { ...params })
}

export function removeMonitor(net, params) {
  return http.post(URL.monitor.removeMonitor(net), { ...params })
}

export function getTrackers(net, params) {
  return http.get(URL.monitor.trackerList(net), {
    params
  })
}

export function checkAddressType(net, params) {
  return http.get(URL.monitor.accountType(net), {
    params
  })
}
