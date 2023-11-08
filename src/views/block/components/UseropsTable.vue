<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { StatusMap } from '@/enums'
  import { getUserOps } from '@/api/modules/stat'
  import TargetsWrapper from '@/components/TargetsWrapper/index.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import { getOffset, formatTime } from '@/utils/time-utils'
  import { useAbortRequest } from '@/hooks/useAbortRequest'
  const props = defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    blockNumber: {
      type: [Number, String],
      default: 0
    }
  })
  const page = useRouteQuery('page', 1, { transform: Number })
  function handleQuery() {
    getList()
  }
  const total = ref(0)
  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getUserOps(props.choosingChain, {
        perPage: 10,
        page: page.value,
        blockNumber: props.blockNumber
      })
      list.value = (res.records || []).map((item) => {
        item.visible = false
        return item
      })
      total.value = res.totalCount
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([])
  onActivated(() => {
    getList()
  })
  useAbortRequest()
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
      label: 'Source',
      prop: 'source',
      width: 120,
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
      label: `Timestamp(UTC${getOffset()})`,
      prop: 'time',
      width: 150,
      render: ({ row }) => {
        return <span>{formatTime(row.time, 'YYYY/MM/DD HH:mm')}</span>
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
      label: 'TxnFee',
      prop: 'fee',
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={'coin-' + row.network}
              class='w-16px! h-16px! mr-4px'
            ></svg-icon>
            <number-show
              number={row.fee}
              format='0,0.[000000]'
              class='fw-600'
            ></number-show>
          </div>
        )
      }
    },
    {
      label: 'Status',
      prop: 'status',
      width: 80,
      render: ({ row }) => {
        return (
          <svg-icon
            iconClass={StatusMap[row.status]?.icon}
            class='w-16px! h-16px! mr-4px'
          ></svg-icon>
        )
      }
    }
  ])
</script>

<template>
  <div v-loading="loading">
    <div
      class="flex flex-wrap gap-16px items-center justify-between px-16px py-16px b-t-1px b-solid b-#EDECEC"
    >
      <number-show
        class="c-#60626a"
        :number="total"
        format="0,0"
        suffix=" UserOp(s) found"
      ></number-show>
      <Pagination
        v-model:total="total"
        v-model:page="page"
        :limit="10"
        @update:page="handleQuery"
      />
    </div>
    <titan-table :data="list" :columns="tableCol"></titan-table>
    <div class="flex justify-end px-16px pt-16px">
      <Pagination
        v-model:total="total"
        v-model:page="page"
        :limit="10"
        @update:page="handleQuery"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
