<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  import { useChainStore } from '@/store/modules/chain'
  import { useRouter } from 'vue-router'
  import BundlerTable from './components/BundlerTable.vue'
  import PaymasterTable from './components/PaymasterTable.vue'
  import FactoryTable from './components/FactoryTable.vue'
  const chainStore = useChainStore()
  const { choosingChain, choosingCoinLogo } = storeToRefs(chainStore)
  defineOptions({
    name: 'CharacterList'
  })
  const router = useRouter()
  function goMore(route) {
    router.push({ ...route })
    // router.push({ name: 'BundlerInfo', params: { bundler: 12345 } })
  }
</script>

<template>
  <div class="grid grid-cols-3 gap-16px items-start character-list">
    <my-card noPad>
      <template #title>
        <svg-icon
          iconClass="bundler"
          class="w-16px! h-16px! mr-4px c-#60626A"
        ></svg-icon>
        <span class="fw-700 text-18px">Bundler List</span>
      </template>
      <template #right>
        <div
          class="px-8px py-6px cursor-pointer bg-#f8f8f8 c-#60626a rd-4px hover:bg-#222 hover:c-#fff"
          @click="goMore({ name: 'BundlerList' })"
        >
          <span class="fw-600">More</span>
          <svg-icon iconClass="turn" class="w-16px! h-16px!"></svg-icon>
        </div>
      </template>
      <BundlerTable
        :network="choosingChain"
        :coinIcon="choosingCoinLogo"
      ></BundlerTable>
    </my-card>
    <my-card noPad>
      <template #title>
        <svg-icon
          iconClass="paymaster"
          class="w-16px! h-16px! mr-4px c-#60626A"
        ></svg-icon>
        <span class="fw-700 text-18px">Paymaster List</span>
      </template>
      <template #right>
        <div
          class="px-8px py-6px cursor-pointer bg-#f8f8f8 c-#60626a rd-4px hover:bg-#222 hover:c-#fff"
          @click="goMore({ name: 'PaymasterList' })"
        >
          <span class="fw-600">More</span>
          <svg-icon iconClass="turn" class="w-16px! h-16px!"></svg-icon>
        </div>
      </template>
      <PaymasterTable
        :network="choosingChain"
        :coinIcon="choosingCoinLogo"
      ></PaymasterTable>
    </my-card>
    <my-card noPad>
      <template #title>
        <svg-icon
          iconClass="factory"
          class="w-16px! h-16px! mr-4px c-#60626A"
        ></svg-icon>
        <span class="fw-700 text-18px">Factory List</span>
      </template>
      <template #right>
        <div
          class="px-8px py-6px cursor-pointer bg-#f8f8f8 c-#60626a rd-4px hover:bg-#222 hover:c-#fff"
          @click="goMore({ name: 'FactoryList' })"
        >
          <span class="fw-600">More</span>
          <svg-icon iconClass="turn" class="w-16px! h-16px!"></svg-icon>
        </div>
      </template>
      <FactoryTable :network="choosingChain"></FactoryTable>
    </my-card>
  </div>
</template>

<style lang="scss" scoped>
  @media screen and (max-width: 992px) {
    .character-list {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
