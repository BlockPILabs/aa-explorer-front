<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useWalletStore } from '@/store/modules/wallet'
  import { useChainStore } from '@/store/modules/chain'
  import { getOverview } from '@/api/modules/monitor'
  import { useStorage, StorageSerializers } from '@vueuse/core'
  import CopyMe from '@/components/CopyMe/index.vue'
  import BalanceChart from './components/BalanceChart.vue'
  import BalanceTable from './components/BalanceTable.vue'
  import LogoutDialog from './components/LogoutDialog.vue'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const walletStore = useWalletStore()
  const { wallet } = storeToRefs(walletStore)

  //   get connector info
  const wagmiStore = useStorage<any | null>('wagmi.store', null, localStorage, {
    mergeDefaults: true,
    serializer: StorageSerializers.object
  })
  const connectorName = computed(() => {
    return (
      wagmiStore.value?.state?.connections?.value?.[0]?.[1]?.connector?.name ||
      'Wallet'
    )
  })
  //   connector img
  const connectorPic = useStorage<any | null>(
    '@w3m/connected_wallet_image_url',
    '',
    localStorage,
    { mergeDefaults: true, serializer: StorageSerializers.string }
  )
  const showDisconnect = ref(false)
  function handleWallet() {
    showDisconnect.value = true
  }
  const list = ref([])
  const totalAmount = ref(0)
  const loading = ref(false)
  async function getInfo() {
    try {
      loading.value = true
      const res = await getOverview(choosingChain.value, {
        userAddress: wallet.value
      })
      list.value = res?.assetDetails || []
      totalAmount.value = Number(res.totalAssetUsd)
    } catch (error) {
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    getInfo()
  })
</script>

<template>
  <div class="wallet-info rd-12px p-16px bg-#fff">
    <div
      class="inline-flex items-center gap-8px rd-40px py-12px px-24px bg-#DEF69E c-#5F8401 cursor-pointer"
      @click="handleWallet"
    >
      <img :src="connectorPic" v-if="connectorPic" class="w-18px h-18px" />
      <CopyMe :hash="wallet" copyIcon="copy_green"></CopyMe>
    </div>
    <h3 class="fw-700 text-18px my-24px">My Wallet Balance</h3>
    <div v-loading="loading">
      <BalanceChart :total="totalAmount" :dataSource="list"></BalanceChart>
      <BalanceTable :total="totalAmount" :dataSource="list"></BalanceTable>
    </div>
    <LogoutDialog
      v-model:visible="showDisconnect"
      :connector-name="connectorName"
      :connector-pic="connectorPic"
    ></LogoutDialog>
  </div>
</template>

<style lang="scss" scoped>
  .wallet-info {
  }
</style>
