<script setup lang="ts">
  import TxnChart from './TxnChart.vue'
  import { getTxnDominance } from '@/api/modules/stat'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import CustomTabs from '@/components/CustomTabs/index.vue'

  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const periods = ref([
    { label: '1D', value: 'h24' },
    { label: '7D', value: 'd7' },
    { label: '1M', value: 'd30' }
  ])
  const currPeriod = ref('d30')
  function handChoose(val) {
    currPeriod.value = val
    getList()
  }
  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getTxnDominance(choosingChain.value, {
        timeRange: currPeriod.value
      })
      list.value = (res?.DominanceDetails || []).map((item) => {
        item.dominance = (parseFloat(item.dominance) * 100).toFixed(2)
        return item
      })
    } catch (error) {
      list.value = []
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([{}])
  onMounted(() => {
    getList()
  })
</script>

<template>
  <my-card class="h-430px" v-loading="loading">
    <template #title>
      <span class="fw-700 text-18px v-middle">AA Txn Dominance%</span>
      <el-tooltip
        content="The percentage of ERC-4337 transactions out of the total transactions."
        placement="top"
      >
        <svg-icon
          iconClass="question"
          class="ml-4px w-16px! h-16px! cursor-pointer v-middle!"
        ></svg-icon>
      </el-tooltip>
    </template>
    <template #right>
      <CustomTabs
        :tabs="periods"
        :currTab="currPeriod"
        @handleChoose="handChoose"
      ></CustomTabs>
    </template>
    <txn-chart class="h-315px" :chartData="list" />
  </my-card>
</template>

<style lang="scss" scoped>
  .period-tag:hover,
  .active-period {
    color: #fff;
    background: #222;
  }
</style>
