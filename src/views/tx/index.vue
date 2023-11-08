<script setup lang="tsx">
  import CopyMe from '@/components/CopyMe/index.vue'
  import TxDetail from '@/components/TxDetail/index.vue'
  import { useRouteParams } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { throttle } from 'lodash-es'
  import { StatusMap } from '@/enums'
  import { getUseropsInTx } from '@/api/modules/stat'
  import TargetsWrapper from '@/components/TargetsWrapper/index.vue'
  import { getOffset, formatTime } from '@/utils/time-utils'
  const chainStore = useChainStore()
  const { choosingChainObj } = chainStore
  const { choosingChain } = storeToRefs(chainStore)
  const tx: any = useRouteParams('tx')

  function visitMore() {
    const url = choosingChainObj.scanTx.replace('{tx}', tx.value)
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes')
  }
  const page = ref(1)
  const total = ref(0)
  const loading = ref(false)
  const noMore = computed(() => {
    return (!total.value || list.value.length >= total.value) && !loading.value
  })
  const disabled = computed(() => loading.value || noMore.value)
  function load() {
    if (disabled.value) return
    const throttled = throttle(() => {
      page.value++
      getList()
    }, 300)
    throttled()
  }
  async function getList() {
    try {
      loading.value = true
      const res = await getUseropsInTx(choosingChain.value, {
        perPage: 15,
        page: page.value,
        txHash: tx.value
      })
      list.value = (res?.records || []).map((item) => {
        item.visible = false
        return item
      })
      total.value = res?.totalCount || 0
      if (15 * (page.value - 1) > total.value) {
        page.value = 1
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([])
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
      label: 'Gas',
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
  const table: any = ref(null)
  function handleScroll(e) {
    const { clientHeight, scrollTop, scrollHeight } = e.target
    if (clientHeight + scrollTop === scrollHeight) {
      load()
    }
  }
  onMounted(() => {
    page.value = 1
    getList()
    nextTick(() => {
      const dom = table.value.$refs.tableRef.$refs.scrollBarRef.wrapRef
      dom.addEventListener('scroll', handleScroll)
    })
  })
</script>

<template>
  <div>
    <div class="flex items-center gap-8px flex-wrap mb-24px">
      <BackTo />
      <span class="fw-700 text-24px">Transaction Hash</span>
      <svg-icon
        :iconClass="'chain-' + choosingChain"
        class="w-24px! h-24px! ml-8px"
      ></svg-icon>
      <span class="fw-600 text-20px break-all">{{ tx }}</span>
      <copy-it :words="tx" class="w-24px! h-24px!"></copy-it>
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

    <my-card noPad>
      <template #title>
        <span class="text-18px fw-700">UserOp List</span>
      </template>
      <template #right>
        <span
          >The transaction contains {{ total }}
          {{ total > 1 ? 'UserOps' : 'UserOp' }}</span
        >
      </template>
      <titan-table
        ref="table"
        :data="list"
        :columns="tableCol"
        :hide-empty="true"
        :max-height="180"
      >
        <template #append>
          <p v-if="noMore" class="text-center pt-32px">No more</p>
        </template>
      </titan-table>
      <p v-if="loading" class="text-center pt-4px">Loading...</p>
    </my-card>
    <my-card headBorder class="mt-24px">
      <template #title>
        <span class="text-18px fw-700">Transaction Info</span>
      </template>
      <TxDetail :choosingChain="choosingChain" :hash="tx"></TxDetail>
    </my-card>
  </div>
</template>

<style lang="scss" scoped></style>
