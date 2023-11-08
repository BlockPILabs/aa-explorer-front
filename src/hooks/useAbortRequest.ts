import { clearPendings } from '@/api/request-abort'

export function useAbortRequest() {
  onDeactivated(() => {
    clearPendings()
  })
}
