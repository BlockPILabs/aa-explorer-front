<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { formatUtcTime } from '@/utils/time-utils'
  import StatChart from './StatChart.vue'
  import { getDaily } from '@/api/modules/stat'
  import { omit } from 'lodash-es'
  import CustomTabs from '@/components/CustomTabs/index.vue'

  const periods = ref([
    { label: '1D', value: 'h24' },
    { label: '7D', value: 'd7' },
    { label: '1M', value: 'd30' }
  ])
  const TitleMap = {
    h24: 'Daily',
    d7: 'Weekly',
    d30: 'Monthly'
  }
  const currPeriod = ref('d30')
  function handChoose(val) {
    currPeriod.value = val
    getStat()
  }
  const chainStore = useChainStore()
  const { choosingChain, choosingCoinLogo } = storeToRefs(chainStore)
  const loading = ref(false)
  function initState() {
    return {
      userOpsNum: 0,
      ups: '0',
      activeAAWallet: 0,
      accumulativeGasFee: '0',
      accumulativeGasFeeUsd: '0',
      paymasterGasPaid: '0',
      paymasterGasPaidUsd: '0',
      bundlerGasProfit: '0',
      bundlerGasProfitUsd: '0',
      lastStatisticTime: new Date().getTime()
    }
  }
  const statInfo = ref(initState())
  const statChartData = ref([])
  async function getStat() {
    try {
      loading.value = true
      const res = await getDaily(choosingChain.value, {
        timeRange: currPeriod.value
      })
      if (res) {
        statInfo.value = omit(res, 'Details')
        statChartData.value = res.Details
      } else {
        throw new Error('empty')
      }
    } catch (error) {
      statInfo.value = initState()
      statChartData.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getStat()
  })
</script>

<template>
  <my-card v-loading="loading">
    <template #title>
      <span class="fw-700 text-18px">AA Statistics</span>
    </template>
    <template #right>
      <CustomTabs
        :tabs="periods"
        :currTab="currPeriod"
        @handleChoose="handChoose"
      ></CustomTabs>
    </template>
    <div class="daily-summary rd-12px b-1px b-solid b-#edecec px-16px py-16px">
      <div class="flex items-center justify-between">
        <span class="fw-600 text-16px">{{ TitleMap[currPeriod] }} Summary</span>
        <span class="c-#60626A"
          >{{ formatUtcTime(statInfo.lastStatisticTime) }}(UTC)</span
        >
      </div>
      <div class="grid gap-x-16px grid-cols-5 summary-list">
        <div class="summary-item">
          <svg-icon iconClass="home-summary-1" class="summary-icon"></svg-icon>
          <div class="summary-label">
            <span class="c-#4270C3">UserOps/UPS</span>
            <el-tooltip content="UserOperations Per Second" placement="top">
              <svg-icon
                iconClass="question"
                class="ml-4px w-16px! h-16px! cursor-pointer"
              ></svg-icon>
            </el-tooltip>
          </div>
          <div class="summary-value">
            <number-show
              :number="statInfo.userOpsNum"
              class="main-value"
            ></number-show>
            <span class="pure-text">({{ statInfo.ups || 0 }} UPS)</span>
          </div>
        </div>
        <div class="summary-item">
          <svg-icon iconClass="home-summary-2" class="summary-icon"></svg-icon>
          <div class="summary-label">
            <span class="c-#CD7014">Account Created</span>
          </div>
          <div class="summary-value">
            <number-show
              :number="statInfo.activeAAWallet"
              class="main-value"
            ></number-show>
          </div>
        </div>
        <div class="summary-item">
          <svg-icon iconClass="home-summary-3" class="summary-icon"></svg-icon>
          <div class="summary-label">
            <span class="c-#289FBE">Accumulative Gas Fee</span>
          </div>
          <div class="summary-value">
            <svg-icon :iconClass="choosingCoinLogo" class="gas-icon"></svg-icon>
            <number-show
              :number="statInfo.accumulativeGasFee"
              format="0.[00]a"
              class="main-value"
            ></number-show>
            <number-show
              class="pure-text"
              :number="statInfo.accumulativeGasFeeUsd"
              format="{$}0,0.[000]"
            ></number-show>
          </div>
        </div>
        <div class="summary-item">
          <svg-icon iconClass="home-summary-4" class="summary-icon"></svg-icon>
          <div class="summary-label">
            <span class="c-#E16FCD">Paymaster Gas Sponsored</span>
          </div>
          <div class="summary-value">
            <svg-icon :iconClass="choosingCoinLogo" class="gas-icon"></svg-icon>
            <number-show
              :number="statInfo.paymasterGasPaid"
              format="0.[00]a"
              class="main-value"
            ></number-show>
            <number-show
              class="pure-text"
              :number="statInfo.paymasterGasPaidUsd"
              format="{$}0,0.[000]"
            ></number-show>
          </div>
        </div>
        <div class="summary-item">
          <svg-icon iconClass="home-summary-5" class="summary-icon"></svg-icon>
          <div class="summary-label">
            <span class="c-#329B57">Bundler Gas Profit</span>
          </div>
          <div class="summary-value">
            <svg-icon :iconClass="choosingCoinLogo" class="gas-icon"></svg-icon>
            <number-show
              :number="statInfo.bundlerGasProfit"
              format="0.[00]a"
              class="main-value"
            ></number-show>
            <number-show
              class="pure-text"
              :number="statInfo.bundlerGasProfitUsd"
              format="{$}0,0.[000]"
            ></number-show>
          </div>
        </div>
      </div>
    </div>
    <stat-chart
      class="mt-16px h-240px"
      :chartData="statChartData"
      :network="choosingChain"
      :coinIcon="choosingCoinLogo"
    />
  </my-card>
</template>

<style lang="scss" scoped>
  .period-tag:hover,
  .active-period {
    color: #fff;
    background: #222;
  }
  .summary-item {
    border-radius: 12px;
    padding: 16px;
    margin-top: 16px;
    &:nth-child(1) {
      background: linear-gradient(180deg, #c2d6ff 0%, #e0e8f8 100%);
    }
    &:nth-child(2) {
      background: linear-gradient(180deg, #f9e3cb 0%, #fbeee0 100%);
    }
    &:nth-child(3) {
      background: linear-gradient(180deg, #d1f0f9 0%, #e0f3f8 100%);
    }
    &:nth-child(4) {
      background: linear-gradient(180deg, #ffdffa 0%, #f9e1ef 100%);
    }
    &:nth-child(5) {
      background: linear-gradient(180deg, #c0f4e6 0%, #ddf4e5 100%);
    }
  }
  .summary-icon {
    width: 32px;
    height: 32px;
  }
  .gas-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .summary-label {
    display: flex;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 700;
  }
  .summary-value {
    display: flex;
    align-items: center;
    .main-value {
      font-size: 20px;
      font-weight: 600;
    }
    .pure-text {
      color: #60626a;
      font-size: 14px;
      margin-left: 4px;
    }
  }
  @media screen and (max-width: 992px) {
    .summary-list {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  @media screen and (max-width: 768px) {
    .summary-list {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media screen and (max-width: 414px) {
    .summary-list {
      grid-template-columns: 1fr;
    }
  }
</style>
