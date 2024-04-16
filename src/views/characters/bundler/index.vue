<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import Pagination from '@/components/Pagination/index.vue'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getBundlerList } from '@/api/modules/stat'
  import { SORT_FIELD_MAP, TABLE_SORT_MAP } from '@/enums/SortMap'
  defineOptions({
    name: 'Bundler'
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
      prop: 'address',
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
      label: 'Total  Bundles',
      prop: 'bundlesNum',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.bundlesNum} />
      }
    },
    {
      label: 'Total Success%',
      prop: 'successRate',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.successRate} format='0.[00]%' />
      }
    },
    {
      label: '24H Success%',
      prop: 'successRateD1',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.successRateD1} format='0.[00]%' />
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
      label: '24H Bundles',
      prop: 'bundlesNumD1',
      align: 'right',
      sortable: 'custom',
      render: ({ row }) => {
        return <number-show number={row.bundlesNumD1} />
      }
    },
    {
      label: 'Profits(24H)',
      prop: 'feeEarnedD1',
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
              number={row.feeEarnedD1}
              class='fw-600 mr-4px'
              format='0,0.[000000]'
            />
            <number-show
              number={row.feeEarnedUsdD1}
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
      const res = await getBundlerList(choosingChain.value, {
        perPage: 15,
        page: page.value,
        sort: SORT_FIELD_MAP.bundlerList[sortField.value] || '',
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
        iconClass="bundler"
        class="w-24px! h-24px! mr-8px c-#60626A"
      ></svg-icon>
      <span class="fw-700 text-24px">Bundler List</span>
    </div>
    <my-card noPad v-loading="loading">
      <template #title>
        <number-show
          class="c-#60626a"
          :number="total"
          format="0,0"
          :suffix="total > 1 ? ' bundlers found' : ' bundler found'"
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
