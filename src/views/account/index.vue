<script setup lang="ts">
  import { useRouteParams, useRouteQuery } from '@vueuse/router'
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import UseropsTable from './components/UseropsTable.vue'
  import TransactionTable from './components/TransactionTable.vue'
  import TransferTable from './components/TransferTable.vue'
  import BalanceTable from './components/BalanceTable.vue'
  import FeatureList from '@/components/FeatureList/index.vue'
  import { formatTime } from '@/utils/time-utils'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { useAccountChain } from '@/hooks/useAccountChain'
  import { getAccountDetail } from '@/api/modules/stat'
  defineOptions({
    name: 'AccountInfo'
  })
  const TAB_STORAGE_KEY = 'choosing-account-tab'

  const account: any = useRouteParams('account')
  const {
    currChainObj,
    currChain,
    chainLoading,
    accountChains,
    currChainLogo,
    currCoinLogo,
    setCurrChain
  } = useAccountChain(account.value)
  function handleCommand(command) {
    setCurrChain(command)
  }
  const currTab = useRouteQuery('tab', 'userops', { transform: String })
  const tabs = [
    { label: 'UserOps', value: 'userops', icon: 'user' },
    { label: 'Transactions', value: 'transaction', icon: 'square_transaction' },
    { label: 'Transfers', value: 'transfer', icon: 'plane' },
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
      account.value
    )
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
  const accountDetail = reactive({
    factory: '',
    factoryTime: undefined,
    totalAmount: undefined
  })
  const detailLoading = ref(false)
  async function getDetail(val) {
    try {
      detailLoading.value = true
      const res = await getAccountDetail(val, {
        address: account.value
      })
      accountDetail.factory = res.factory
      accountDetail.factoryTime = res.factoryTime
      accountDetail.totalAmount = res.totalAmount
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
    <div class="mb-24px flex justify-between flex-wrap">
      <div class="flex items-center gap-8px flex-wrap">
        <BackTo />
        <span class="fw-700 text-24px">Account</span>
        <svg-icon
          :iconClass="currChainLogo"
          class="w-24px! h-24px! ml-24px ml-8px"
        ></svg-icon>
        <span class="fw-600 text-20px break-all">{{ account }}</span>
        <copy-it :words="account" class="w-24px! h-24px!"></copy-it>
        <div class="w-1px h-24px bg-#dbdcdd mx-8px"></div>
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
      <FeatureList v-loading="detailLoading">
        <div>
          <div class="label">
            <span>Account Balance</span>
          </div>
          <div class="value">
            <number-show
              :number="accountDetail?.totalAmount || 0"
              format="{$}0,0.[000000]"
            ></number-show>
          </div>
        </div>
        <!-- <div>
          <div class="label">
            <span>Account Dominance</span>
            <el-tooltip content="???" placement="top">
              <svg-icon
                iconClass="question"
                class="ml-4px w-16px! h-16px! cursor-pointer"
              ></svg-icon>
            </el-tooltip>
          </div>
          <div class="value">
            <number-show :number="0.0025" format="0.[00]%"></number-show>
          </div>
        </div> -->
        <!-- <div>
          <div class="label">
            <span>Account Rank</span>
            <el-tooltip content="???" placement="top">
              <svg-icon
                iconClass="question"
                class="ml-4px w-16px! h-16px! cursor-pointer"
              ></svg-icon>
            </el-tooltip>
          </div>
          <div class="value">
            <span>No.-</span>
          </div>
        </div> -->
        <div v-show="accountDetail?.factory">
          <div class="label">
            <span>Deployment Time</span>
          </div>
          <div class="value">
            <span>{{
              formatTime(accountDetail?.factoryTime, 'YYYY/MM/DD HH:mm')
            }}</span>
          </div>
        </div>
        <div v-show="accountDetail?.factory">
          <div class="label">
            <span>Factory</span>
          </div>
          <div class="value">
            <CopyMe
              :hash="accountDetail.factory"
              class="c-#30754B"
              :routeInfo="{
                name: 'FactoryInfo',
                params: {
                  factory: accountDetail.factory
                }
              }"
            />
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
              :account="account"
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
