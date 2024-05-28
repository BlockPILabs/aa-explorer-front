<script setup lang="ts">
  import { useRouteParams, useRouteQuery } from '@vueuse/router'
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import GasSponsorTable from './components/GasSponsorTable.vue'
  import TransactionTable from './components/TransactionTable.vue'
  import TransferTable from './components/TransferTable.vue'
  import ReserveTable from './components/ReserveTable.vue'
  import BalanceTable from './components/BalanceTable.vue'
  import FeatureList from '@/components/FeatureList/index.vue'
  import { useAccountChain } from '@/hooks/useAccountChain'
  import { getPaymasterDetail } from '@/api/modules/stat'
  defineOptions({
    name: 'PaymasterInfo'
  })
  const TAB_STORAGE_KEY = 'choosing-paymaster-tab'

  const paymaster: any = useRouteParams('paymaster')
  const {
    currChainObj,
    currChain,
    chainLoading,
    accountChains,
    currChainLogo,
    currCoinLogo,
    setCurrChain
  } = useAccountChain(paymaster.value)
  function handleCommand(command) {
    setCurrChain(command)
  }

  const currTab = useRouteQuery('tab', 'gas-sponsored', { transform: String })
  const tabs = [
    { label: 'Gas Sponsored', value: 'gas-sponsored', icon: 'paymaster' },
    { label: 'Transactions', value: 'transaction', icon: 'square_transaction' },
    { label: 'Transfers', value: 'transfer', icon: 'plane' },
    { label: 'Balance', value: 'balance', icon: 'wallet' },
    { label: 'Reserve', value: 'reserve', icon: 'reserve' }
  ]

  function handChoose(val) {
    currTab.value = val
  }

  const currCom = computed(() => {
    let com
    switch (currTab.value) {
      case 'gas-sponsored':
        com = GasSponsorTable
        break
      case 'transaction':
        com = TransactionTable
        break
      case 'transfer':
        com = TransferTable
        break
      case 'reserve':
        com = ReserveTable
        break
      case 'balance':
        com = BalanceTable
        break
      default:
        com = GasSponsorTable
        break
    }
    return com
  })

  function visitMore() {
    const url = currChainObj.value.scanAddress.replace(
      '{address}',
      paymaster.value
    )
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
  const initState = {
    sponsorGasFee24h: 0,
    userOpsNum24h: 0,
    sponsorGasFeeTotal: 0,
    userOpsNumTotal: 0,
    dominance: 0,
    rank: 0,
    accountBalance: 0,
    estimateTxnNum: 0,
    label: [],
    totalNumber: 0
  }
  const paymasterDetail = reactive({ ...initState })
  const detailLoading = ref(false)
  async function getDetail(val) {
    try {
      detailLoading.value = true
      const res = await getPaymasterDetail(val, {
        paymaster: paymaster.value
      })
      paymasterDetail.sponsorGasFee24h = res.sponsorGasFee24h
      paymasterDetail.userOpsNum24h = res.userOpsNum24h
      paymasterDetail.sponsorGasFeeTotal = res.sponsorGasFeeTotal
      paymasterDetail.userOpsNumTotal = res.userOpsNumTotal
      paymasterDetail.dominance = res.dominance
      paymasterDetail.rank = res.rank
      paymasterDetail.accountBalance = res.accountBalance
      paymasterDetail.estimateTxnNum = res.estimateTxnNum
      paymasterDetail.label = res.label || []
      paymasterDetail.totalNumber = res.totalNumber
    } catch (error) {
      console.error(error)
      Object.assign(paymasterDetail, initState)
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
        <span class="fw-700 text-24px">Paymaster</span>
        <svg-icon
          :iconClass="currChainLogo"
          class="w-24px! h-24px! ml-8px"
        ></svg-icon>
        <span class="fw-600 text-20px break-all">{{ paymaster }}</span>
        <copy-it :words="paymaster" class="w-24px! h-24px!"></copy-it>
        <div class="w-1px h-24px bg-#dbdcdd mx-8px"></div>
        <div
          v-for="it in paymasterDetail.label"
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
        :networkIcon="currChainLogo"
        :networkObj="currChainObj"
        :list="accountChains"
        :loading="chainLoading"
        @handle-command="handleCommand"
      ></AccountChain>
    </div>
    <div class="detail-main gap-16px relative flex items-start">
      <FeatureList>
        <div>
          <div class="label">
            <span>24H Gas Sponsored</span>
          </div>
          <div class="value">
            <number-show
              :number="paymasterDetail.sponsorGasFee24h"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
          <div class="sub-value">
            <number-show
              :number="paymasterDetail.userOpsNum24h"
              format="0,0{ UserOp(s)}"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Total Gas Sponsored</span>
          </div>
          <div class="value">
            <number-show
              :number="paymasterDetail.sponsorGasFeeTotal"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
          <div class="sub-value">
            <number-show
              :number="paymasterDetail.userOpsNumTotal"
              format="0,0{ UserOp(s)}"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Paymaster Dominance</span>
          </div>
          <div class="value">
            <number-show
              :number="paymasterDetail.dominance"
              format="0.[00]%"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Paymaster Rank</span>
            <el-tooltip
              content="Ranked by accumulative gas sponsored"
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
              >No.{{ paymasterDetail.rank }}/{{
                paymasterDetail.totalNumber
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
              :number="paymasterDetail.accountBalance"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
          <div class="sub-value">
            <number-show
              :number="paymasterDetail.estimateTxnNum"
              format="{estimate to sponsor }0,0{ Txn}"
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
              :coinIcon="currCoinLogo"
              :paymaster="paymaster"
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
