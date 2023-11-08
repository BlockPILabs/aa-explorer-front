<script setup lang="tsx">
  import { storeToRefs } from 'pinia'
  import CopyMe from '@/components/CopyMe/index.vue'
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import { useChainStore } from '@/store/modules/chain'
  import BundlerTable from './components/BundlerTable.vue'
  import PaymasterTable from './components/PaymasterTable.vue'
  import FactoryTable from './components/FactoryTable.vue'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const listTypes = ref([
    { label: 'Bundler', value: 'bundler', icon: 'bundler' },
    { label: 'Paymaster', value: 'paymaster', icon: 'paymaster' },
    { label: 'Factory', value: 'factory', icon: 'factory' }
  ])
  const currType = ref('bundler')
  function handChoose(val) {
    if (currType.value === val) return
    currType.value = val
  }
  const currCom = computed(() => {
    if (currType.value === 'bundler') {
      return BundlerTable
    } else if (currType.value === 'paymaster') {
      return PaymasterTable
    } else {
      return FactoryTable
    }
  })
</script>

<template>
  <my-card class="min-h-460px">
    <template #title>
      <span class="fw-700 text-18px">24H Top</span>
    </template>
    <template #right>
      <CustomTabs
        :tabs="listTypes"
        :currTab="currType"
        @handleChoose="handChoose"
      ></CustomTabs>
    </template>
    <keep-alive>
      <component :is="currCom" :network="choosingChain"></component>
    </keep-alive>
  </my-card>
</template>

<style lang="scss" scoped></style>
