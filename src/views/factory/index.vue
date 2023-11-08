<script setup lang="ts">
  import { useRouteParams } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import AccountTable from './components/AccountTable.vue'
  import FeatureList from '@/components/FeatureList/index.vue'
  import { useAccountChain } from '@/hooks/useAccountChain'
  import { getFactoryDetail } from '@/api/modules/stat'
  defineOptions({
    name: 'FactoryInfo'
  })

  const factory: any = useRouteParams('factory')
  const { currChainObj, currChain, chainLoading, accountChains, setCurrChain } =
    useAccountChain(factory.value)
  function handleCommand(command) {
    setCurrChain(command)
  }
  function visitMore() {
    const url = currChainObj.value.scanAddress.replace(
      '{address}',
      factory.value
    )
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
  const factoryDetail = reactive({
    accountDeployNum: 0,
    accountDeployNumD1: 0,
    userOpsNum: 0,
    rank: 0,
    label: [],
    dominance: 0,
    totalNumber: 0
  })
  const detailLoading = ref(false)
  async function getDetail(val) {
    try {
      detailLoading.value = true
      const res = await getFactoryDetail(val, factory.value)
      factoryDetail.accountDeployNum = res.accountDeployNum
      factoryDetail.accountDeployNumD1 = res.accountDeployNumD1
      factoryDetail.userOpsNum = res.userOpsNum
      factoryDetail.rank = res.rank
      factoryDetail.dominance = res.dominance
      factoryDetail.label = res.label || []
      factoryDetail.totalNumber = res.totalNumber
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
        <span class="fw-700 text-24px">Factory</span>
        <svg-icon
          :iconClass="'chain-' + currChain"
          class="w-24px! h-24px! ml-8px"
        ></svg-icon>
        <span class="fw-600 text-20px break-all">{{ factory }}</span>
        <copy-it :words="factory" class="w-24px! h-24px!"></copy-it>
        <div class="w-1px h-24px bg-#dbdcdd mx-8px"></div>
        <div
          v-for="it in factoryDetail.label"
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
        <div>
          <div class="label">
            <span>24H Accounts Deployed</span>
          </div>
          <div class="value">
            <number-show
              :number="factoryDetail.accountDeployNumD1"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Total Accounts Deployed</span>
          </div>
          <div class="value">
            <number-show :number="factoryDetail.accountDeployNum"></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Total UserOps</span>
          </div>
          <div class="value">
            <number-show :number="factoryDetail.userOpsNum"></number-show>
          </div>
          <div class="sub-value">
            <number-show
              :number="factoryDetail.dominance"
              format="0.[00]%"
            ></number-show>
          </div>
        </div>
        <div>
          <div class="label">
            <span>Factory Rank</span>
            <el-tooltip
              content="Ranked by number of contract wallets created"
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
              >No.{{ factoryDetail.rank }}/{{ factoryDetail.totalNumber }}</span
            >
          </div>
        </div>
      </FeatureList>
      <div class="flex-1 of-hidden">
        <my-card noPad class="min-h-400px">
          <template #title>
            <span class="text-18px fw-700">Account</span>
          </template>
          <AccountTable
            :choosingChain="currChain"
            :factory="factory"
          ></AccountTable>
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
