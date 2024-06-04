<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import Pagination from '@/components/Pagination/index.vue'
  import { MEVTypeMap } from '@/enums'
  import { getAttacks, getMevInfo } from '@/api/modules/stat'
  import { getOffset, formatTime } from '@/utils/time-utils'
  import { capitalize } from 'lodash-es'
  import { SORT_FIELD_MAP, TABLE_SORT_MAP } from '@/enums/SortMap'
  import CopyMe from '@/components/CopyMe/index.vue'

  defineOptions({
    name: 'MevMonitorList'
  })
  const chainStore = useChainStore()
  const { choosingChain, choosingCoinLogo } = storeToRefs(chainStore)
  const page = useRouteQuery('page', 1, { transform: Number })
  const sortField = ref('')
  const sortOrder = ref('')
  function handleQuery() {
    getList()
  }
  const total = ref(0)

  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getAttacks(choosingChain.value, {
        perPage: 15,
        page: page.value,
        totalCount: total.value,
        sort: SORT_FIELD_MAP.blockMevList[sortField.value] || '',
        order: TABLE_SORT_MAP[sortOrder.value] || ''
      })

      list.value = (res?.records || []).map((item) => {
        item.visible = false
        return item
      })
      total.value = res?.totalCount || 0
      if (15 * (page.value - 1) > total.value) {
        page.value = 1
        nextTick(() => {
          getList()
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([])
  const statInfo = reactive({
    attackerTotalProfit: 0,
    mevUserOpsRatio: 0,
    attackerAccounts: 0
  })
  const statLoading = ref(false)
  async function getStat() {
    try {
      statLoading.value = true
      const res = await getMevInfo(choosingChain.value)
      const { attackerTotalProfit, mevUserOpsRatio, attackerAccounts } = res
      statInfo.attackerTotalProfit = attackerTotalProfit
      statInfo.mevUserOpsRatio = mevUserOpsRatio
      statInfo.attackerAccounts = attackerAccounts
    } catch (error) {
      console.error(error)
      statInfo.attackerTotalProfit = 0
      statInfo.mevUserOpsRatio = 0
      statInfo.attackerAccounts = 0
    } finally {
      statLoading.value = false
    }
  }
  onMounted(() => {
    getList()
    getStat()
  })

  const tableCol = ref<any>([
    {
      label: `Timestamp(UTC${getOffset()})`,
      prop: 'timestamp',
      minWidth: 150,
      render: ({ row }) => {
        return <span>{formatTime(row.timestamp, 'YYYY/MM/DD HH:mm')}</span>
      }
    },
    {
      label: 'UserOp Hash',
      prop: 'userOpHash',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.userOpHash}
            class='c-#30754B'
            routeInfo={{
              name: 'UseropInfo',
              params: { userop: row.userOpHash },
              query: { tx: row.txHash }
            }}
          />
        )
      }
    },
    {
      label: 'MEV Type',
      prop: 'mevType',
      minWidth: 120,
      render: ({ row }) => {
        const color = MEVTypeMap[row.mevType]?.color || '#5D55F0'
        const bgColor = MEVTypeMap[row.mevType]?.bg || '#F0F5FF'
        return (
          <div
            class='inline-flex py-2px px-4px items-center gap-4px rd-4px'
            style={{ color: color, backgroundColor: bgColor }}
          >
            <svg-icon
              iconClass={`home-${MEVTypeMap[row.mevType]?.icon || 'frontrun'}`}
              class='w-16px! h-16px!'
            ></svg-icon>
            <span>{MEVTypeMap[row.mevType]?.label || ''}</span>
          </div>
        )
      }
    },
    {
      label: 'Victim',
      prop: 'victim',
      minWidth: 150,
      render: ({ row }) => {
        let routeInfo = {}
        if (row.victimType === 'bundler') {
          routeInfo = {
            name: 'BundlerInfo',
            params: { bundler: row.victim }
          }
        } else {
          routeInfo = {
            name: 'AccountInfo',
            params: { account: row.victim }
          }
        }
        const victimType =
          row.victimType?.length > 0 ? (
            <span class='c-#fff px-4px py-2px rd-4px bg-#6EA7E9'>
              {capitalize(row.victimType)}
            </span>
          ) : (
            ''
          )
        return (
          <div class='inline-flex flex-col items-start gap-4px'>
            <CopyMe hash={row.victim} class='c-#30754B' routeInfo={routeInfo} />
            {victimType}
          </div>
        )
      }
    },

    {
      label: 'Attacker',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.attacker}
            class='c-#30754B'
            routeInfo={{
              name: 'AccountInfo',
              params: { account: row.attacker }
            }}
          />
        )
      }
    },
    {
      prop: 'bundlerLoss',
      align: 'right',
      sortable: 'custom',
      minWidth: 150,
      label: 'Bundler Loss',
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={choosingCoinLogo.value}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.bundlerLoss}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.bundlerLossInUsd}
                format='{&asymp;$}0,0.[000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
      }
    },
    {
      prop: 'mevProfits',
      align: 'right',
      sortable: 'custom',
      minWidth: 150,
      label: 'MEV Profits',
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={choosingCoinLogo.value}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.mevProfits}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.mevProfitsInUsd}
                format='{&asymp;$}0,0.[000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
      }
    }
  ])
  function handleSortChange(params) {
    sortField.value = params.prop
    sortOrder.value = params.order
    page.value = 1
    getList()
  }
</script>

<template>
  <div>
    <el-row :gutter="16" class="userop-overview" v-loading="statLoading">
      <el-col :lg="8">
        <div
          class="info-item flex items-center px-16px py-16px rd-12px bg-#EAE7FB"
        >
          <div class="icon-box rd-8px px-4px py-4px bg-#DED8FF mr-20px">
            <svg-icon
              iconClass="outline_sandwich"
              class="w-32px! h-32px! c-#BA99FF"
            ></svg-icon>
          </div>
          <div class="flex flex-col">
            <span class="c-#60626A">Attacker Total Profit</span>
            <number-show
              :number="statInfo.attackerTotalProfit"
              format="$0,0.[000]"
              class="text-24px mt-8px fw-700"
            ></number-show>
          </div>
        </div>
      </el-col>
      <el-col :lg="8">
        <div
          class="info-item flex items-center px-16px py-16px rd-12px bg-#D0F1D0"
        >
          <div class="icon-box rd-8px px-4px py-4px bg-#D0F8C2 mr-20px">
            <svg-icon
              iconClass="outline_sandwich"
              class="w-32px! h-32px! c-#89E493"
            ></svg-icon>
          </div>
          <div class="flex flex-col">
            <span class="c-#60626A">MEV UserOps Ratio</span>
            <number-show
              :number="statInfo.mevUserOpsRatio"
              format="0.[00]%"
              class="text-24px mt-8px fw-700"
            ></number-show>
          </div>
        </div>
      </el-col>
      <el-col :lg="8">
        <div
          class="info-item flex items-center px-16px py-16px rd-12px bg-#F1DDEF"
        >
          <div class="icon-box rd-8px px-4px py-4px bg-#F5C7F0 mr-20px">
            <svg-icon
              iconClass="outline_sandwich"
              class="w-32px! h-32px! c-#FF82F2"
            ></svg-icon>
          </div>
          <div class="flex flex-col">
            <span class="c-#60626A">Attacker Accounts</span>
            <number-show
              :number="statInfo.attackerAccounts"
              class="text-24px mt-8px fw-700"
            ></number-show>
          </div>
        </div>
      </el-col>
    </el-row>
    <my-card noPad v-loading="loading">
      <template #title>
        <span class="text-18px c-#303030 fw-700">Latest Attacks</span>
      </template>
      <div
        class="px-16px pb-16px flex items-center justify-between flex-wrap gap-16px"
      >
        <number-show
          class="c-#60626a"
          :number="total"
          format="0,0"
          suffix=" attack(s) found"
        ></number-show>
        <Pagination
          v-model:total="total"
          v-model:page="page"
          @update:page="handleQuery"
        />
      </div>
      <titan-table
        :data="list"
        :columns="tableCol"
        @sort-change="handleSortChange"
      ></titan-table>
      <div class="flex justify-end px-16px pt-16px">
        <Pagination
          v-model:total="total"
          v-model:page="page"
          @update:page="handleQuery"
        />
      </div>
    </my-card>
  </div>
</template>

<style lang="scss" scoped>
  .userop-overview {
    .el-col {
      margin-bottom: 16px;
    }
  }
</style>
