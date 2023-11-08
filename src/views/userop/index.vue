<script setup lang="ts">
  import { useRouteParams, useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import DetailsTable from './components/DetailsTable.vue'
  import TxDetail from '@/components/TxDetail/index.vue'
  import FeatureList from '@/components/FeatureList/index.vue'
  import { getOffset, formatTime } from '@/utils/time-utils'
  import CopyMe from '@/components/CopyMe/index.vue'
  import TargetsWrapper from '@/components/TargetsWrapper/index.vue'
  import { formatHash } from '@/utils/formatHash'
  import { getUseropDetail } from '@/api/modules/stat'
  defineOptions({
    name: 'UseropInfo'
  })

  const chainStore = useChainStore()
  const { choosingChainObj } = chainStore
  const { choosingChain } = storeToRefs(chainStore)
  const userop: any = useRouteParams('userop')
  const currTab = useRouteQuery('tab', 'details', { transform: String })
  const tabs = [
    { label: 'Developer Details', value: 'details', icon: 'code' },
    { label: 'Txn Info', value: 'transaction', icon: 'square_transaction' }
  ]

  function handChoose(val) {
    currTab.value = val
  }

  const currCom = computed(() => {
    let com
    switch (currTab.value) {
      case 'details':
        com = DetailsTable
        break
      case 'transaction':
        com = TxDetail
        break
      default:
        com = DetailsTable
        break
    }
    return com
  })

  function visitMore() {
    const url = choosingChainObj.scanTx.replace(
      '{tx}',
      useropDetail.value.txHash
    )
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
  function toggleShow(item) {
    useropDetail.value.visible = !item.visible
  }
  const tx = useRouteQuery('tx')
  const useropDetail: any = ref({
    txHash: tx.value
  })
  const detailLoading = ref(false)
  async function getDetail() {
    try {
      detailLoading.value = true
      const res = await getUseropDetail(choosingChain.value, {
        userOperationHash: userop.value,
        txHash: tx.value
      })
      useropDetail.value = { ...res, visible: false }
    } catch (error) {
      console.error(error)
    } finally {
      detailLoading.value = false
    }
  }
  onMounted(() => {
    getDetail()
  })
</script>

<template>
  <div>
    <div class="flex items-center gap-8px flex-wrap mb-24px">
      <BackTo />
      <span class="fw-700 text-24px">UserOp Hash</span>
      <svg-icon
        :iconClass="'chain-' + choosingChain"
        class="w-24px! h-24px! ml-8px"
      ></svg-icon>
      <span class="fw-600 text-20px break-all">{{ userop }}</span>
      <copy-it :words="userop" class="w-24px! h-24px!"></copy-it>
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
    <div class="detail-main gap-16px relative flex items-start">
      <FeatureList v-loading="detailLoading">
        <template #title>
          <span class="text-18px fw-700">UserOp Details</span>
        </template>
        <div>
          <div class="label">
            <span>Timestamp(UTC{{ getOffset() }})</span>
          </div>
          <div class="value">
            <span class="text-18px fw-600">{{
              formatTime(useropDetail.time, 'YYYY/MM/DD HH:mm')
            }}</span>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Sender</span>
          </div>
          <div class="value">
            <CopyMe
              class="c-#30754B"
              :hash="useropDetail.sender"
              :route-info="{
                name: 'AccountInfo',
                params: { account: useropDetail.sender }
              }"
            />
          </div>
          <div class="label mt-16px">
            <span>Target</span>
          </div>
          <div class="value c-#30754B!">
            <TargetsWrapper
              :info="useropDetail"
              :usePop="false"
              @toggleShow="toggleShow"
            />
          </div>
        </div>
        <div>
          <div class="label">
            <span>Fee</span>
          </div>
          <div class="value">
            <svg-icon
              :iconClass="'coin-' + choosingChain"
              class="w-16px! h-16px! mr-4px"
            ></svg-icon>
            <number-show
              :number="useropDetail.fee"
              format="0,0.[000000]"
            ></number-show>
            <number-show
              class="pure-text block"
              :number="useropDetail.feeUsd"
              format="{($}0,0.[000000]{)}"
            ></number-show>
          </div>
          <div class="label mt-16px">
            <span>Gas Usage</span>
          </div>
          <div class="value">
            <span>{{ useropDetail.actualGasUsed }}</span>
          </div>
          <div class="label mt-16px">
            <span>Value</span>
          </div>
          <div class="value">
            <svg-icon
              :iconClass="'coin-' + choosingChain"
              class="w-16px! h-16px! mr-4px"
            ></svg-icon>
            <number-show
              :number="useropDetail.txValue"
              format="0,0.[000000]"
            ></number-show>
            <number-show
              class="pure-text block"
              :number="useropDetail.txValueUsd"
              format="{($}0,0.[000000]{)}"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Source</span>
          </div>
          <div class="value">
            <span>{{ useropDetail.source }}</span>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Transaction Hash</span>
          </div>
          <div class="value">
            <CopyMe
              class="c-#30754B"
              :hash="useropDetail.txHash"
              :routeInfo="{
                name: 'TxInfo',
                params: {
                  tx: useropDetail.txHash
                }
              }"
            />
          </div>
        </div>
        <div>
          <div class="label">
            <span>Block</span>
          </div>
          <div class="value">
            <span>{{ useropDetail.blockNumber }}</span>
          </div>
          <div class="sub-value">
            <span
              >{{ useropDetail.confirmBlock - useropDetail.blockNumber }} Block
              Confirmed</span
            >
          </div>
        </div>
        <div>
          <div class="label">
            <span>Bundler</span>
          </div>
          <div class="value">
            <router-link
              class="c-#30754B mr-4px"
              :to="{
                name: 'BundlerInfo',
                params: {
                  bundler: useropDetail.bundler
                }
              }"
            >
              {{
                (useropDetail?.bundlerLabel || [])[0] ||
                formatHash(useropDetail?.bundler)
              }}</router-link
            >
            <copy-it :words="useropDetail.bundler"></copy-it>
          </div>
          <div class="label mt-16px">
            <span>Bundler Profits</span>
          </div>
          <div class="value">
            <svg-icon
              :iconClass="'coin-' + choosingChain"
              class="w-16px! h-16px! mr-4px"
            ></svg-icon>
            <number-show
              :number="useropDetail.bundlerProfit"
              format="0,0.[000000]"
            ></number-show>
            <number-show
              class="pure-text block"
              :number="useropDetail.bundlerProfitUsd"
              format="{($}0,0.[000000]{)}"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Paymaster</span>
          </div>
          <div class="value">
            <router-link
              class="c-#30754B mr-4px"
              :to="{
                name: 'PaymasterInfo',
                params: {
                  paymaster: useropDetail.paymaster
                }
              }"
            >
              {{
                (useropDetail?.paymasterLabel || [])[0] ||
                formatHash(useropDetail?.paymaster)
              }}</router-link
            >
            <copy-it :words="useropDetail.paymaster"></copy-it>
          </div>
          <div class="label mt-16px">
            <span>Gas Sponsored</span>
          </div>
          <div class="value">
            <svg-icon
              :iconClass="'coin-' + choosingChain"
              class="w-16px! h-16px! mr-4px"
            ></svg-icon>
            <number-show
              :number="useropDetail.fee"
              format="0,0.[000000]"
            ></number-show>
            <number-show
              class="pure-text block"
              :number="useropDetail.feeUsd"
              format="{($}0,0.[000000]{)}"
            ></number-show>
          </div>
        </div>
      </FeatureList>
      <div class="flex-1 of-hidden">
        <my-card class="min-h-400px" headBorder>
          <template #title>
            <span class="text-18px fw-700">UserOp Analysis</span>
          </template>
          <template #right>
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
              :hash="useropDetail.txHash"
              :loading="detailLoading"
              :useropDetail="useropDetail"
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
