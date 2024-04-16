<script setup lang="tsx">
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getBundlerList } from '@/api/modules/stat'
  import { SORT_FIELD_MAP, TABLE_SORT_MAP } from '@/enums/SortMap'
  import { useTitanTableScrollHeight } from '@/hooks/useTitanTableScrollHeight'

  const props = defineProps({
    network: {
      type: String,
      default: ''
    },
    coinIcon: {
      type: String,
      default: ''
    }
  })
  const sortField = ref('')
  const sortOrder = ref('')
  const page = ref(1)
  const perPage = ref(15)
  const loading = ref(false)
  const list = ref<any>([])
  const total = ref(0)
  const noMore = computed(() => {
    return (!total.value || list.value.length >= total.value) && !loading.value
  })
  const disabled = computed(() => loading.value || noMore.value)

  const tableCol = ref<any>([
    {
      label: 'Address',
      prop: 'bundler',
      minWidth: 120,
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
      label: 'Bundles',
      prop: 'bundlesNum',
      sortable: 'custom',
      render: ({ row }) => {
        return (
          <div>
            <number-show number={row.bundlesNum} />
            <number-show
              number={row.bundleRate}
              format='0.[00]%'
              class='c-#93959C ml-8px'
            />
          </div>
        )
      }
    },
    {
      label: 'Profits(24H)',
      prop: 'feeEarnedD1',
      align: 'right',
      sortable: 'custom',
      minWidth: 140,
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={props.coinIcon}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.feeEarnedD1}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.feeEarnedUsdD1}
                format='{&asymp;$}0,0.[000000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
      }
    }
  ])
  function load() {
    if (disabled.value) return
    page.value++
    getList()
  }
  async function getList() {
    try {
      loading.value = true
      const res = await getBundlerList(props.network, {
        perPage: perPage.value,
        page: page.value,
        sort: SORT_FIELD_MAP.bundlerList[sortField.value] || '',
        order: TABLE_SORT_MAP[sortOrder.value] || ''
      })
      total.value = res?.totalCount
      if (page.value === 1) {
        list.value = (res?.records || []).map((item) => {
          item.visible = false
          return item
        })
      } else {
        const newList = (res?.records || []).map((item) => {
          item.visible = false
          return item
        })
        list.value = list.value.concat(...newList)
      }
    } catch (error) {
      console.error(error)
      if (page.value > 1) {
        page.value--
      }
    } finally {
      loading.value = false
    }
  }
  function handleSortChange(params) {
    sortField.value = params.prop
    sortOrder.value = params.order
    page.value = 1
    getList()
  }

  const { table, tableHeight } = useTitanTableScrollHeight()

  onMounted(() => {
    page.value = 1
    getList()
  })
</script>

<template>
  <div>
    <titan-table
      ref="table"
      :data="list"
      :columns="tableCol"
      class="fixed-height-table"
      :hide-empty="true"
      height="100%"
      :max-height="tableHeight"
      v-el-table-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      @sort-change="handleSortChange"
    >
      <template #append>
        <p v-if="noMore" class="text-center pt-32px">No more</p>
        <p v-if="loading" class="text-center pt-4px">Loading...</p>
      </template>
    </titan-table>
  </div>
</template>

<style lang="scss" scoped>
  .fixed-height-table.titan-table {
    :deep() {
      .el-table tbody td {
        padding: 0px;
        height: 69px;
      }
    }
  }
</style>
