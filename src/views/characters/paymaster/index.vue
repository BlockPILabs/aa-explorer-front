<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import Pagination from '@/components/Pagination/index.vue'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getPaymasterList } from '@/api/modules/stat'
  import { SORT_FIELD_MAP, TABLE_SORT_MAP } from '@/enums/SortMap'
  defineOptions({
    name: 'Paymaster'
  })
  const chainStore = useChainStore()
  const { choosingChain, choosingCoinLogo } = storeToRefs(chainStore)
  const sortField = ref('')
  const sortOrder = ref('')
  const page = useRouteQuery('page', 1, { transform: Number })
  function handleQuery() {
    getList()
  }
  const loading = ref(false)
  const total = ref(0)
  const list = ref<any>([{}])
  const tableCol = ref<any>([
    {
      label: 'Address',
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
      label: 'Total UserOps',
      prop: 'userOpsNum',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.userOpsNum} />
      }
    },
    {
      label: '24H UserOps',
      prop: 'userOpsNumD1',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.userOpsNumD1} />
      }
    },
    {
      label: 'Reserve',
      prop: 'reserve',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.reserve} format='{$}0,0.[000000]' />
      }
    },
    {
      label: 'Gas Sponsored',
      prop: 'gasSponsored',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={choosingCoinLogo.value}
              class='w-16px! h-16px! mr-4px'
            ></svg-icon>
            <number-show
              number={row.gasSponsored}
              class='fw-600 mr-4px'
              format='0,0.[000000]'
            />
            <number-show
              number={row.gasSponsoredUsd}
              format='{&asymp;$}0,0.[000000]'
              class='c-#93959C'
            />
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
  async function getList() {
    try {
      loading.value = true
      const res = await getPaymasterList(choosingChain.value, {
        perPage: 15,
        page: page.value,
        sort: SORT_FIELD_MAP.paymasterList[sortField.value] || '',
        order: TABLE_SORT_MAP[sortOrder.value] || ''
      })

      total.value = res?.totalCount || 0
      list.value = res?.records || []
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
  onMounted(() => {
    getList()
  })
</script>

<template>
  <div>
    <div class="p-x-16px mb-16px">
      <svg-icon
        iconClass="paymaster"
        class="w-24px! h-24px! mr-8px c-#60626A"
      ></svg-icon>
      <span class="fw-700 text-24px">Paymaster List</span>
    </div>
    <my-card noPad v-loading="loading">
      <template #title>
        <number-show
          class="c-#60626a"
          :number="total"
          format="0,0"
          :suffix="total > 1 ? ' paymasters found' : ' paymaster found'"
        ></number-show>
      </template>
      <template #right>
        <Pagination
          v-model:total="total"
          v-model:page="page"
          @update:page="handleQuery"
        />
      </template>
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

<style lang="scss" scoped></style>
