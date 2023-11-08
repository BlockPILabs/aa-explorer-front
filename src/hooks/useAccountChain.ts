import { getExistChains } from '@/api/modules/chains'
import { storeToRefs } from 'pinia'
import { useChainStore } from '@/store/modules/chain'
import { useRouteQuery } from '@vueuse/router'
export function useAccountChain(address) {
  const chainStore = useChainStore()
  const { choosingChainObj } = chainStore
  const { choosingChain, supportChains } = storeToRefs(chainStore)
  const network = useRouteQuery('network')
  const accountChains: any = ref([])
  const currChainObj: any = ref({})
  const currChain = computed(() => {
    return currChainObj.value?.network || ''
  })
  const defaultNetwork = computed(() => {
    return network.value || choosingChain.value
  })
  const chainLoading = ref(false)
  async function getChains() {
    try {
      chainLoading.value = true
      const res = await getExistChains({
        address
      })
      const chains = res?.chains || []
      accountChains.value = supportChains.value.filter((o) =>
        chains.includes(o.network)
      )
      if (
        accountChains.value.findIndex(
          (o) => o.network === defaultNetwork.value
        ) > -1
      ) {
        currChainObj.value = choosingChainObj
      } else {
        currChainObj.value = accountChains.value[0]
      }
    } catch (error) {
      currChainObj.value = choosingChainObj
    } finally {
      chainLoading.value = false
    }
  }
  function setCurrChain(obj) {
    currChainObj.value = obj
  }
  onMounted(() => {
    getChains()
  })
  return { currChainObj, currChain, chainLoading, accountChains, setCurrChain }
}
