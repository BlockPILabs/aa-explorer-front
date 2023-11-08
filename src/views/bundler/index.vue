<script setup lang="ts">
  import { useRouteParams, useRouteQuery } from '@vueuse/router'
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import UseropsTable from './components/UseropsTable.vue'
  import TransactionTable from './components/TransactionTable.vue'
  import TransferTable from './components/TransferTable.vue'
  import MevTable from './components/MevTable.vue'
  import BalanceTable from './components/BalanceTable.vue'
  import FeatureList from '@/components/FeatureList/index.vue'
  import { useAccountChain } from '@/hooks/useAccountChain'
  import { getBundlerDetail } from '@/api/modules/stat'
  defineOptions({
    name: 'BundlerInfo'
  })

  const bundler: any = useRouteParams('bundler')
  const { currChainObj, currChain, chainLoading, accountChains, setCurrChain } =
    useAccountChain(bundler.value)
  function handleCommand(command) {
    setCurrChain(command)
  }

  const currTab = useRouteQuery('tab', 'userops', { transform: String })
  const tabs = [
    { label: 'UserOps', value: 'userops', icon: 'user' },
    { label: 'Transactions', value: 'transaction', icon: 'square_transaction' },
    { label: 'Transfers', value: 'transfer', icon: 'plane' },
    { label: 'MEV', value: 'mev', icon: 'outline_sandwich' },
    { label: 'Balance', value: 'balance', icon: 'wallet' }
  ]

  function handChoose(val) {
    currTab.value = val
  }

  const currCom = computed(() => {
    let com
    switch (currTab.value) {
      case 'userops':
        com = UseropsTable
        break
      case 'transaction':
        com = TransactionTable
        break
      case 'transfer':
        com = TransferTable
        break
      case 'mev':
        com = MevTable
        break
      case 'balance':
        com = BalanceTable
        break
      default:
        com = UseropsTable
        break
    }
    return com
  })

  function visitMore() {
    const url = currChainObj.value.scanAddress.replace(
      '{address}',
      bundler.value
    )
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
  const bundlerDetail = reactive({
    feeEarnedUsdD1: 0,
    feeEarnedUsd: 0,
    successRateD1: 0,
    successRate: 0,
    bundleRate: 0,
    rank: 0,
    totalBundlers: 0,
    label: []
  })
  const detailLoading = ref(false)
  async function getDetail(val) {
    try {
      detailLoading.value = true
      const res = await getBundlerDetail(val, bundler.value)
      bundlerDetail.feeEarnedUsdD1 = res.feeEarnedUsdD1
      bundlerDetail.feeEarnedUsd = res.feeEarnedUsd
      bundlerDetail.successRateD1 = res.successRateD1
      bundlerDetail.successRate = res.successRate
      bundlerDetail.bundleRate = res.bundleRate
      bundlerDetail.rank = res.rank
      bundlerDetail.totalBundlers = res.totalBundlers
      bundlerDetail.label = res.label || []
    } catch (error) {
      console.error(error)
    } finally {
      detailLoading.value = false
    }
  }
  watch(currChain, (val) => {
    val && getDetail(val)
  })
</script>

<template>
  <div>
    <div class="flex justify-between flex-wrap mb-24px">
      <div class="flex items-center gap-8px flex-wrap">
        <BackTo />
        <span class="fw-700 text-24px">Bundler</span>
        <svg-icon
          :iconClass="'chain-' + currChain"
          class="w-24px! h-24px! ml-8px"
        ></svg-icon>
        <span class="fw-600 text-20px break-all">{{ bundler }}</span>
        <copy-it :words="bundler" class="w-24px! h-24px!"></copy-it>
        <div class="w-1px h-24px bg-#dbdcdd mx-8px"></div>
        <div
          v-for="it in bundlerDetail.label"
          class="inline-flex items-center px-8px py-6px rd-4px bg-#D8DFFF c-#60626A"
        >
          <svg-icon
            :iconClass="'label-' + it"
            class="w-16px! h-16px! mr-4px"
          ></svg-icon>
          <span>{{ it }}</span>
        </div>
        <div
          class="flex items-center justify-start px-8px py-6px rd-4px b-1px b-solid b-#dbdcdd cursor-pointer fw-600 c-#60626A hover:bg-#222 hover:c-#fff"
          @click="visitMore"
        >
          <span>View on {{ currChainObj.scanName }}</span>
          <svg-icon
            iconClass="next_page"
            class="w-16px! h-16px! ml-4px"
          ></svg-icon>
        </div>
      </div>
      <AccountChain
        :network="currChain"
        :networkObj="currChainObj"
        :list="accountChains"
        :loading="chainLoading"
        @handle-command="handleCommand"
      ></AccountChain>
    </div>
    <div class="detail-main gap-16px relative flex items-start">
      <FeatureList v-loading="detailLoading">
        <!-- <template #title>
          <span>Calculated by 123,456 txns</span>
        </template> -->
        <div>
          <div class="label">
            <span>24H Profits</span>
          </div>
          <div class="value">
            <number-show
              :number="bundlerDetail.feeEarnedUsdD1"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Total Profits</span>
          </div>
          <div class="value">
            <number-show
              :number="bundlerDetail.feeEarnedUsd"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>24H Success%</span>
          </div>
          <div class="value">
            <number-show
              :number="bundlerDetail.successRateD1"
              format="0.[00]%"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Success%</span>
          </div>
          <div class="value">
            <number-show
              :number="bundlerDetail.successRate"
              format="0.[00]%"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Bundle Dominance</span>
            <el-tooltip
              content="The percentage of UserOperations processed compared to the total number of UserOperations"
              placement="top"
            >
              <svg-icon
                iconClass="question"
                class="ml-4px w-16px! h-16px! cursor-pointer"
              ></svg-icon>
            </el-tooltip>
          </div>
          <div class="value">
            <number-show
              :number="bundlerDetail.bundleRate"
              format="0.[00]%"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Bundler Rank</span>
            <el-tooltip
              content="Ranked by total number of UserOperations processed"
              placement="top"
            >
              <svg-icon
                iconClass="question"
                class="ml-4px w-16px! h-16px! cursor-pointer"
              ></svg-icon>
            </el-tooltip>
          </div>
          <div class="value">
            <span
              >No.{{ bundlerDetail.rank }}/{{
                bundlerDetail.totalBundlers
              }}</span
            >
          </div>
        </div>
        <div>
          <div class="label">
            <span>Account Balance</span>
          </div>
          <div class="value">
            <number-show
              :number="214.56"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
        </div>
      </FeatureList>
      <div class="flex-1 of-hidden">
        <my-card noPad class="min-h-400px">
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
              :choosingChain="currChain"
              :bundler="bundler"
            ></component>
          </KeepAlive>
        </my-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @media screen and (max-width: 992px) {
    .detail-main {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
