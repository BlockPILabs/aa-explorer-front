<script setup lang="tsx">
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getRank } from '@/api/modules/whale'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { useTitanTableScrollHeight } from '@/hooks/useTitanTableScrollHeight'
  const chainStore = useChainStore()
  const { choosingChain, choosingChainLogo } = storeToRefs(chainStore)

  const page = ref(1)
  const perPage = ref(20)
  const loading = ref(false)
  const list = ref<any>([])
  const total = ref(0)
  const noMore = computed(() => {
    return (!total.value || list.value.length >= total.value) && !loading.value
  })
  const disabled = computed(() => loading.value || noMore.value)

  const tableCol = ref<any>([
    {
      type: 'index',
      label: '#',
      width: 80,
      render: ({ index }) => {
        if (index <= 2) {
          return (
            <svg-icon
              iconClass={`whale-rank_${index + 1}`}
              class='w-20px! h-20px!'
            ></svg-icon>
          )
        } else {
          return (
            <span class='inline-block min-w-20px h-20px text-center'>
              {index + 1}
            </span>
          )
        }
      }
    },
    {
      label: 'Address',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <div>
            <svg-icon
              iconClass={choosingChainLogo.value}
              class='w-16px! h-16px! mr-4px'
            ></svg-icon>
            <CopyMe
              hash={row.address}
              class='c-#30754B'
              routeInfo={{
                name: 'AccountInfo',
                params: { account: row.address }
              }}
            />
          </div>
        )
      }
    },
    {
      label: 'Wallet Balance',
      minWidth: 120,
      render: ({ row }) => {
        return (
          <div>
            <number-show number={row.balance} format='$0,0.[000000]' />
          </div>
        )
      }
    },
    {
      label: 'Percentage',
      align: 'right',
      minWidth: 100,
      render: ({ row }) => {
        return (
          <div>
            <number-show number={row.percentage} format='0.[00]%' />
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
      const res = await getRank(choosingChain.value, {
        perPage: perPage.value,
        page: page.value
      })
      total.value = res?.totalCount
      if (page.value === 1) {
        list.value = res?.TopWhaleRankList || []
      } else {
        const newList = res?.TopWhaleRankList || []
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
  const { table, tableHeight } = useTitanTableScrollHeight()

  onMounted(() => {
    page.value = 1
    getList()
  })
</script>

<template>
  <div class="bg-#fff rd-12px p-16px">
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
        height: 42px;
      }
      th.el-table__cell {
        border: none;
        background: none;
      }
      .el-table__body {
        border-spacing: 0px 10px;
        tr {
          background: none;
        }
        td.el-table__cell {
          background: #f4f6ef;
          border: none;
          &:first-of-type {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          &:last-of-type {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }
      }
    }
  }
</style>
