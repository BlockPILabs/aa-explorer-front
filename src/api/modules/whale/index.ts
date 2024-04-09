import { http } from '@/api/request'
import { URL } from '@/api/urls'

export function getOverview(net) {
  return http.get(URL.whale.overview(net))
}

export function getChart(net, params) {
  return http.get(URL.whale.chart(net), {
    params
  })
}

export function getRank(net, params) {
  return http.get(URL.whale.rank(net), {
    params
  })
}
