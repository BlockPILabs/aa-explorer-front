import { defineStore } from 'pinia'
import { useStorage, StorageSerializers } from '@vueuse/core'

const CHAIN_STORAGE_KEY = 'choosing-chain-obj'

export const useChainStore = defineStore('chain', () => {
  const choosingChainObj = useStorage<any | null>(
    CHAIN_STORAGE_KEY,
    null,
    localStorage,
    { mergeDefaults: true, serializer: StorageSerializers.object }
  )
  const choosingChain = computed(() => {
    return choosingChainObj.value?.network || undefined
  })
  const supportChains = ref<any[]>([])

  function updateSupportChains(chains: any[]) {
    supportChains.value.splice(0, supportChains.value.length, ...chains)

    if (!choosingChain.value) {
      choosingChainObj.value = chains[0]
    } else {
      const chain = chains.find((o) => o.network === choosingChain.value)
      choosingChainObj.value = Object.assign({}, choosingChainObj.value, chain)
    }
  }

  function updateChooseChain(chain: any) {
    choosingChainObj.value = chain
  }

  const choosingChainLogo = computed(() => {
    return choosingChainObj.value?.chainIcon || ''
  })

  const choosingCoinLogo = computed(() => {
    return choosingChainObj.value?.coinIcon || ''
  })
  return {
    supportChains,
    choosingChainObj,
    choosingChain,
    choosingChainLogo,
    choosingCoinLogo,
    updateSupportChains,
    updateChooseChain
  }
})
