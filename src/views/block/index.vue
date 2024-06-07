<script setup lang="tsx">
  import { useRouteParams, useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import UseropsTable from './components/UseropsTable.vue'
  import MevTable from './components/MevTable.vue'
  import CustomTabs from '@/components/CustomTabs/index.vue'

  defineOptions({
    name: 'BlockInfo'
  })
  const TAB_STORAGE_KEY = 'choosing-bundler-tab'
  const chainStore = useChainStore()
  const { choosingChainObj } = chainStore
  const { choosingChain, choosingChainLogo, choosingCoinLogo } =
    storeToRefs(chainStore)

  const blockNumber: any = useRouteParams('blockNumber')
  const tabs = [
    { label: 'Userops', value: 'userops', icon: 'user' },
    { label: 'MEV', value: 'mev', icon: 'outline_sandwich' }
  ]
  const currTab = useRouteQuery('tab', 'userops', { transform: String })
  function handChoose(val) {
    currTab.value = val
  }
  const currCom = computed(() => {
    if (currTab.value === 'userops') {
      return UseropsTable
    } else {
      return MevTable
    }
  })
  function visitMore() {
    const url = choosingChainObj.scanBlock.replace('{block}', blockNumber.value)
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
</script>

<template>
  <div>
    <div class="flex gap-8px items-center flex-wrap mb-24px">
      <BackTo />
      <span class="fw-700 text-24px">Block</span>
      <svg-icon
        :iconClass="choosingChainLogo"
        class="w-24px! h-24px! ml-8px"
      ></svg-icon>
      <span class="fw-600 text-20px break-all">{{ blockNumber }}</span>
      <copy-it :words="blockNumber" class="w-24px! h-24px!"></copy-it>
      <div class="w-1px h-24px bg-#dbdcdd mx-8px"></div>
      <div
        class="inline-flex items-center justify-start px-8px py-6px rd-4px b-1px b-solid b-#dbdcdd cursor-pointer fw-600 c-#60626A hover:bg-#222 hover:c-#fff"
        @click="visitMore"
      >
        <span>View on {{ choosingChainObj.scanName }}</span>
        <svg-icon
          iconClass="next_page"
          class="w-16px! h-16px! ml-4px"
        ></svg-icon>
      </div>
    </div>

    <my-card noPad class="min-h-620px">
      <template #title>
        <CustomTabs
          :tabs="tabs"
          :currTab="currTab"
          @handleChoose="handChoose"
        ></CustomTabs>
      </template>
      <KeepAlive>
        <component
          :is="currCom"
          :choosingChain="choosingChain"
          :coinIcon="choosingCoinLogo"
          :blockNumber="blockNumber"
        ></component>
      </KeepAlive>
    </my-card>
  </div>
</template>

<style lang="scss" scoped></style>
