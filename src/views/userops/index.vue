<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import Pagination from '@/components/Pagination/index.vue'
  import TimeAgo from '@/components/TimeAgo/index.vue'
  import TargetsWrapper from '@/components/TargetsWrapper/index.vue'
  import { StatusMap } from '@/enums'
  import { getUserOps, getLatestUserOps } from '@/api/modules/stat'

  import CopyMe from '@/components/CopyMe/index.vue'

  import { getOffset } from '@/utils/time-utils'
  defineOptions({
    name: 'UserOpList'
  })
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const page = useRouteQuery('page', 1, { transform: Number })
  function handleQuery() {
    getList()
  }
  const total = ref(0)

  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getUserOps(choosingChain.value, {
        perPage: 15,
        page: page.value,
        totalCount: total.value
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
    averageProcessTime24h: 0,
    averageGasCost24h: 0,
    pendingTransactionNum: 0
  })
  const statLoading = ref(false)
  async function getStat() {
    try {
      statLoading.value = true
      const res = await getLatestUserOps(choosingChain.value)
      const {
        averageProcessTime24h,
        averageGasCost24h,
        pendingTransactionNum
      } = res
      statInfo.averageProcessTime24h = averageProcessTime24h
      statInfo.averageGasCost24h = averageGasCost24h
      statInfo.pendingTransactionNum = pendingTransactionNum
    } catch (error) {
      console.error(error)
      statInfo.averageProcessTime24h = 0
      statInfo.averageGasCost24h = 0
      statInfo.pendingTransactionNum = 0
    } finally {
      statLoading.value = false
    }
  }
  onMounted(() => {
    getList()
    getStat()
  })
  function toggleShow(item) {
    const obj = list.value.find(
      (o) => o.userOperationHash === item.userOperationHash
    )
    obj.visible = !obj.visible
  }
  function hidePopover(item) {
    const obj = list.value.find(
      (o) => o.userOperationHash === item.userOperationHash
    )
    obj.visible = false
  }
  const tableCol = ref<any>([
    {
      label: 'UserOp Hash',
      prop: 'userOperationHash',
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.userOperationHash}
            class='c-#30754B'
            routeInfo={{
              name: 'UseropInfo',
              params: { userop: row.userOperationHash },
              query: { tx: row.txHash }
            }}
          />
        )
      }
    },

    {
      label: `Timestamp(UTC${getOffset()})`,
      prop: 'time',
      width: 150,
      render: ({ row }) => {
        return <TimeAgo time={row.time} suffix=' ago'></TimeAgo>
      }
    },
    {
      label: 'Sender',
      prop: 'sender',
      width: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.sender}
            class='c-#30754B'
            routeInfo={{
              name: 'AccountInfo',
              params: { account: row.sender }
            }}
          />
        )
      }
    },
    {
      label: '',
      width: 50,
      render: () => {
        return <svg-icon iconClass='home-to' class='w-20px! h-20px!'></svg-icon>
      }
    },
    {
      label: 'Target',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <div class='c-#30754B'>
            <TargetsWrapper
              info={row}
              onHidePopover={hidePopover}
              onToggleShow={toggleShow}
            />
          </div>
        )
      }
    },
    {
      label: 'Source',
      prop: 'source',
      minWidth: 120,
      render: ({ row }) => {
        return (
          <el-tooltip
            content={row.source}
            placement='top'
            disabled={!row.source}
          >
            <span class='text-truncate inline-block px-8px py-2px c-#60626A rd-4px w-96px h-21px bg-#CBDAFA text-center'>
              {row.source}
            </span>
          </el-tooltip>
        )
      }
    },
    {
      label: 'Status',
      prop: 'status',
      width: 100,
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={StatusMap[row.status]?.icon}
              class='w-16px! h-16px! mr-4px'
            ></svg-icon>
            <span>{StatusMap[row.status]?.label}</span>
          </div>
        )
      }
    }
  ])
</script>

<template>
  <div>
    <div class="p-x-16px mb-16px">
      <svg-icon
        iconClass="user"
        class="w-24px! h-24px! mr-8px c-#60626A"
      ></svg-icon>
      <span class="fw-700 text-24px">UserOp List</span>
    </div>
    <el-row :gutter="16" class="userop-overview" v-loading="statLoading">
      <el-col :lg="8">
        <div
          class="info-item flex items-center px-16px py-16px rd-12px bg-#EAE7FB"
        >
          <div class="icon-box rd-8px px-4px py-4px bg-#DED8FF mr-20px">
            <svg-icon
              iconClass="home-time"
              class="w-32px! h-32px! c-#BA99FF"
            ></svg-icon>
          </div>
          <div class="flex flex-col">
            <span class="c-#60626A">Average Processing Time(1H)</span>
            <number-show
              :number="statInfo.averageProcessTime24h"
              format="0,0{s}"
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
              iconClass="home-gas"
              class="w-32px! h-32px! c-#89E493"
            ></svg-icon>
          </div>
          <div class="flex flex-col">
            <span class="c-#60626A">Average Gas Consumed(24H)</span>
            <number-show
              :number="statInfo.averageGasCost24h"
              format="0,0.[000000]"
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
              iconClass="home-pending_transaction"
              class="w-32px! h-32px! c-#FF82F2"
            ></svg-icon>
          </div>
          <div class="flex flex-col">
            <span class="c-#60626A">Pending Transaction</span>
            <number-show
              :number="statInfo.pendingTransactionNum"
              class="text-24px mt-8px fw-700"
            ></number-show>
          </div>
        </div>
      </el-col>
    </el-row>
    <my-card noPad v-loading="loading">
      <template #title>
        <number-show
          class="c-#60626a"
          :number="total"
          format="0,0"
          suffix=" UserOp(s) found"
        ></number-show>
      </template>
      <template #right>
        <Pagination
          v-model:total="total"
          v-model:page="page"
          @update:page="handleQuery"
        />
      </template>
      <titan-table :data="list" :columns="tableCol"></titan-table>
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
