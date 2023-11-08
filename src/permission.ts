import router from '@/router'
import { useChainStore } from '@/store/modules/chain'
import { getChains } from '@/api/modules/chains'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = []

router.beforeEach(async (_to, _from, next) => {
  NProgress.start()
  const store = useChainStore()
  // next()
  if (store.supportChains.length === 0) {
    try {
      const res = await getChains()
      store.updateSupportChains(res.records)
      next()
    } catch (error) {
      console.error(error)
      next()
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
