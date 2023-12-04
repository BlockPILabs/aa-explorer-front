<script setup lang="tsx">
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getFactoryList } from '@/api/modules/stat'
  import { SORT_FIELD_MAP, TABLE_SORT_MAP } from '@/enums/SortMap'
  import { throttle } from 'lodash-es'
  const props = defineProps({
    network: {
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
      prop: 'factory',
      minWidth: 120,
      render: ({ row }) => {
        const dom = row.factoryLabel ? (
          <div class='inline-flex mt-4px px-4px py-2px rd-4px bg-#D8DFFF c-#60626A'>
            <span>{row.factoryLabel}</span>
          </div>
        ) : (
          ''
        )
        return (
          <div>
            <CopyMe
              hash={row.factory}
              class='c-#30754B'
              routeInfo={{
                name: 'FactoryInfo',
                params: { factory: row.factory }
              }}
            />
            {dom}
          </div>
        )
      }
    },
    {
      label: 'Active Accounts',
      prop: 'accountNumD1',
      sortable: 'custom',
      minWidth: 130,
      render: ({ row }) => {
        return (
          <div>
            <number-show number={row.accountNumD1} />
            <number-show
              number={row.dominanceD1}
              format='0.[00]%'
              class='ml-8px c-#93959C'
            />
          </div>
        )
      }
    },
    {
      label: 'Total Accounts',
      prop: 'accountNum',
      align: 'right',
      sortable: 'custom',
      minWidth: 120,
      render: ({ row }) => {
        return <number-show number={row.accountNum} />
      }
    }
  ])
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
      const res = await getFactoryList(props.network, {
        perPage: perPage.value,
        page: page.value,
        sort: SORT_FIELD_MAP.factoryList[sortField.value] || '',
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
  function handleScroll(e) {
    const { clientHeight, scrollTop, scrollHeight } = e.target
    if (clientHeight + scrollTop === scrollHeight) {
      load()
    }
  }
  const table: any = ref(null)
  const tableHeight = ref(0)
  const { height } = useWindowSize()
  const { top } = useElementBounding(table)

  onMounted(() => {
    page.value = 1
    getList()
    nextTick(() => {
      tableHeight.value = height.value - top.value - 60
      const dom = table.value.$refs.tableRef.$refs.scrollBarRef.wrapRef
      dom.addEventListener('scroll', handleScroll)
    })
  })
  onBeforeUnmount(() => {    
    const dom = table.value.$refs.tableRef.$refs.scrollBarRef.wrapRef
    dom.removeEventListener('scroll', handleScroll)
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
      :max-height="tableHeight"
      @sort-change="handleSortChange"
    >
      <template #append>
        <p v-if="noMore" class="text-center pt-32px">No more</p>
      </template>
    </titan-table>
    <p v-if="loading" class="text-center pt-4px">Loading...</p>
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
@/enums/SortMap
