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
    account: {
      type: [Number, String],
      default: 0
    },
    coinIcon: {
      type: String,
      default: ''
    }
  })
  const page = useRouteQuery('page', 1, { transform: Number })
  function handleQuery() {
    getList()
  }
  const total = ref(0)
  const loading = ref(false)
  async function getList() {
    if (!props.choosingChain) return
    try {
      loading.value = true
      const res = await getUserOps(props.choosingChain, {
        perPage: 15,
        page: page.value,
        account: props.account
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
      list.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([])
  watch(
    () => props.choosingChain,
    () => {
      getList()
    }
  )
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
      label: `Timestamp(UTC${getOffset()})`,
      prop: 'time',
      width: 150,
      render: ({ row }) => {
        return <span>{formatTime(row.time, 'YYYY/MM/DD HH:mm')}</span>
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
      label: 'Gas Fee',
      prop: 'fee',
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={props.coinIcon}
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
    },
    {
      label: 'Bundler',
      prop: 'bundler',
      render: ({ row }) => {
        const dom = row.bundlerLabel ? (
          <div class='inline-flex mt-4px px-4px py-2px rd-4px bg-#D8DFFF c-#60626A'>
            <span>{row.bundlerLabel}</span>
          </div>
        ) : (
          ''
        )
        return (
          <div>
            <CopyMe
              hash={row.bundler}
              class='c-#30754B'
              routeInfo={{
                name: 'BundlerInfo',
                params: { bundler: row.bundler }
              }}
            />
            {dom}
          </div>
        )
      }
    },
    {
      label: 'Paymaster',
      prop: 'paymaster',
      render: ({ row }) => {
        const dom = row.paymasterLabel ? (
          <div class='inline-flex mt-4px px-4px py-2px rd-4px bg-#D8DFFF c-#60626A'>
            <span>{row.paymasterLabel}</span>
          </div>
        ) : (
          ''
        )
        return (
          <div>
            <CopyMe
              hash={row.paymaster}
              class='c-#30754B'
              routeInfo={{
                name: 'PaymasterInfo',
                params: { paymaster: row.paymaster }
              }}
            />
            {dom}
          </div>
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
        @update:page="handleQuery"
      />
    </div>
    <titan-table :data="list" :columns="tableCol"></titan-table>
    <div class="flex justify-end px-16px pt-16px">
      <Pagination
        v-model:total="total"
        v-model:page="page"
        @update:page="handleQuery"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
