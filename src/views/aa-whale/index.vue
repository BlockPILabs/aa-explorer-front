<script setup lang="ts">
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import TxnChart from './components/TxnChart.vue'
  import WhaleTable from './components/WhaleTable.vue'
  import { getChart, getOverview } from '@/api/modules/whale'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  const chainStore = useChainStore()
  const { choosingChain, choosingChainObj } = storeToRefs(chainStore)
  const periods = ref([
    { label: '1D', value: 'h24' },
    { label: '7D', value: 'd7' },
    { label: '1M', value: 'd30' }
  ])
  const currPeriod = ref('h24')
  function handChoose(val) {
    currPeriod.value = val
    getList()
  }
  const loading = ref(false)
  const list = ref<any>([{}])
  async function getList() {
    try {
      loading.value = true
      const res = await getChart(choosingChain.value, {
        timeRange: currPeriod.value
      })
      list.value = res?.details || []
    } catch (error) {
      list.value = []
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const infoLoading = ref(false)
  const whalesTxnDominace = ref(0)
  const whalesRatio = ref(0)
  const whalesAssets = ref(0)
  const whalesETHBalance = ref(0)
  async function getStat() {
    try {
      infoLoading.value = true
      const res = await getOverview(choosingChain.value)
      whalesTxnDominace.value = res?.txDominance || 0
      whalesRatio.value = res?.ratio || 0
      whalesAssets.value = res?.totalAssetUsd || 0
      whalesETHBalance.value = res?.totalEthUsd || 0
    } catch (error) {
      console.error(error)
    } finally {
      infoLoading.value = false
    }
  }
  onMounted(() => {
    getList()
    getStat()
  })
  defineOptions({
    name: 'AAWhale'
  })
</script>

<template>
  <div>
    <div class="mb-24px">
      <span class="fw-700 text-24px">AA Whale Ranking</span>
    </div>
    <el-row :gutter="16">
      <el-col :md="8">
        <div
          v-loading="infoLoading"
          class="info-item w-full p-16px rd-12px mb-16px flex items-center gap-16px bg-#EAE7FB"
        >
          <div class="w-40px h-40px rd-8px p-4px bg-#DED8FF">
            <svg-icon
              iconClass="whale"
              class="w-32px! h-32px! c-#BA99FF"
            ></svg-icon>
          </div>
          <div>
            <p class="flex gap-4px items-center mb-8px">
              <span class="c-#60626A">AA Whales Txn Dominance %</span>
              <el-tooltip
                placement="top"
                content="The percentage of ERC-4337 transactions from whales in the past 7 days to the total ERC-4337 transactions."
              >
                <svg-icon
                  iconClass="question"
                  class="w-16px! h-16px!"
                ></svg-icon>
              </el-tooltip>
            </p>
            <number-show
              :number="whalesTxnDominace"
              format="0.[00]%"
              class="fw-700 text-24px"
            ></number-show>
          </div>
        </div>
        <div
          v-loading="infoLoading"
          class="info-item w-full p-16px rd-12px mb-16px flex items-center gap-16px bg-#D0F1D0"
        >
          <div class="w-40px h-40px rd-8px p-4px bg-#D0F8C2">
            <svg-icon
              iconClass="whale"
              class="w-32px! h-32px! c-#89E493"
            ></svg-icon>
          </div>
          <div>
            <p class="flex gap-4px items-center mb-8px">
              <span class="c-#60626A">AA Whales Ratio</span>
              <el-tooltip
                placement="top"
                content="Number of whales over total users."
              >
                <svg-icon
                  iconClass="question"
                  class="w-16px! h-16px!"
                ></svg-icon>
              </el-tooltip>
            </p>
            <number-show
              :number="whalesRatio"
              format="0.[00]%"
              class="fw-700 text-24px"
            ></number-show>
          </div>
        </div>
        <div
          v-loading="infoLoading"
          class="info-item w-full p-16px rd-12px mb-16px flex items-center gap-16px bg-#F1DDEF"
        >
          <div class="w-40px h-40px rd-8px p-4px bg-#F5C7F0">
            <svg-icon
              iconClass="whale"
              class="w-32px! h-32px! c-#FF82F2"
            ></svg-icon>
          </div>
          <div>
            <p class="flex gap-4px items-center mb-8px">
              <span class="c-#60626A">Whales Total Assets</span>
            </p>
            <number-show
              :number="whalesAssets"
              format="$0,0.[000000]"
              class="fw-700 text-24px"
            ></number-show>
          </div>
        </div>
        <div
          v-loading="infoLoading"
          class="info-item w-full p-16px rd-12px mb-16px flex items-center gap-16px bg-#DCF1F6"
        >
          <div class="w-40px h-40px rd-8px p-4px bg-#C3E4F3">
            <svg-icon
              iconClass="whale"
              class="w-32px! h-32px! c-#6AC8FD"
            ></svg-icon>
          </div>
          <div>
            <p class="flex gap-4px items-center mb-8px">
              <span class="c-#60626A"
                >Whales Total
                {{ choosingChainObj?.nativeSymbol || 'ETH' }} Balance</span
              >
            </p>
            <number-show
              :number="whalesETHBalance"
              format="$0,0.[000000]"
              class="fw-700 text-24px"
            ></number-show>
          </div>
        </div>
        <my-card class="h-343px mb-16px">
          <template #title>
            <span class="fw-600 text-16px">Holding Chart</span>
          </template>
          <template #right>
            <CustomTabs
              :tabs="periods"
              :currTab="currPeriod"
              @handleChoose="handChoose"
            ></CustomTabs>
          </template>
          <txn-chart v-loading="loading" class="h-250px" :chartData="list" />
        </my-card>
      </el-col>
      <el-col :md="16"><WhaleTable></WhaleTable></el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
