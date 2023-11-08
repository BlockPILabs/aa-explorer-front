import { http } from '@/api/request'
import { URL } from '@/api/urls'

export function searchTerm(net, params) {
  return http.get(URL.search.search(net), {
    params
  })
}
