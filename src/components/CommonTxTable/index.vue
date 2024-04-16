<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getAATransactionList } from '@/api/modules/stat'
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
      const res = await getAATransactionList(props.choosingChain, {
        perPage: 15,
        page: page.value,
        address: props.address
      })
      list.value = res?.records || []
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
      prop: 'hash',
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.hash}
            class='c-#30754B'
            routeInfo={{
              name: 'TxInfo',
              params: { tx: row.hash }
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
              {row.source || 'Handle Ops'}
            </span>
          </el-tooltip>
        )
      }
    },
    {
      label: 'Block',
      prop: 'blockNumber',
      render: ({ row }) => {
        return (
          <router-link
            to={{ name: 'BlockInfo', params: { blockNumber: row.blockNumber } }}
            class='c-#30754B'
          >
            {row.blockNumber}
          </router-link>
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
      label: 'From',
      prop: 'fromAddr',
      width: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.fromAddr}
            class='c-#30754B'
            routeInfo={{
              name: 'AccountInfo',
              params: { account: row.fromAddr }
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
      label: 'To',
      prop: 'toAddr',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.toAddr}
            class='c-#30754B'
            routeInfo={{
              name: 'AccountInfo',
              params: { account: row.toAddr }
            }}
          />
        )
      }
    },
    {
      label: 'Value',
      prop: 'value',
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={props.coinIcon}
              class='w-16px! h-16px! mr-4px'
            ></svg-icon>
            <number-show
              number={row.value / 1e18}
              format='0,0.[000000]'
              class='fw-600'
            ></number-show>
          </div>
        )
      }
    },
    {
      label: 'TxnFee',
      render: ({ row }) => {
        return (
          <number-show
            number={(row.gasUsed * row.gasPrice) / 1e18}
            format='0,0.[000000]'
            class='fw-600'
          ></number-show>
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
        suffix=" transacation(s) found"
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
