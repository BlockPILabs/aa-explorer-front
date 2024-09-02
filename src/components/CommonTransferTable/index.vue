<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getUserTransfers } from '@/api/modules/stat'
  import Pagination from '@/components/Pagination/index.vue'
  import { getOffset, formatTime } from '@/utils/time-utils'
  import { useAbortRequest } from '@/hooks/useAbortRequest'
  const props = defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    address: {
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
    if (!props.choosingChain) return
    try {
      loading.value = true
      const res = await getUserTransfers(props.choosingChain, {
        perPage: 15,
        page: page.value,
        address: props.address
      })
      list.value = (res?.transferList || []).map((item) => {
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
  const tableCol = ref<any>([
    {
      label: 'Txn Hash',
      prop: 'txnHash',
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.txnHash}
            class='c-#30754B'
            routeInfo={{
              name: 'TxInfo',
              params: { tx: row.txnHash }
            }}
          />
        )
      }
    },
    {
      label: 'Source',
      prop: 'source',
      width: 140,
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
      prop: 'timestamp',
      width: 150,
      render: ({ row }) => {
        return <span>{formatTime(row.timestamp, 'YYYY/MM/DD HH:mm')}</span>
      }
    },
    {
      label: 'From',
      prop: 'from',
      width: 150,
      render: ({ row }) => {
        return <CopyMe hash={row.from} class='c-#30754B' />
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
      label: 'To',
      minWidth: 150,
      render: ({ row }) => {
        return <CopyMe hash={row.to} class='c-#30754B' />
      }
    },
    {
      label: 'Value',
      prop: 'value',
      render: ({ row }) => {
        return (
          <number-show
            number={row.value}
            format='0,0.[000000]'
            class='fw-600'
          ></number-show>
        )
      }
    },
    {
      label: 'Token',
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={row?.tokenImage || 'https://static.blockpi.io/coins-logo/eth.svg'}
              class='w-16px! h-16px! mr-4px'
            ></svg-icon>
            <span>
              <span class='c-#93959C'>{row.tokenSymbol}</span>
            </span>
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
        suffix=" transfer(s) found"
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
