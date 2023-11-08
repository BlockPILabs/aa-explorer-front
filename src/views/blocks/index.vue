<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import Pagination from '@/components/Pagination/index.vue'
  import { getBlockList } from '@/api/modules/stat'
  defineOptions({
    name: 'BlockList'
  })
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const page = useRouteQuery('page', 1, { transform: Number })
  function handleQuery() {
    getList()
  }
  const total = ref(0)
  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getBlockList(choosingChain.value, {
        perPage: 15,
        page: page.value
      })

      total.value = res?.totalCount || 0
      list.value = (res?.records || []).map((item) => {
        item.visible = false
        return item
      })
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
  const list = ref<any>([])
  onMounted(() => {
    getList()
  })
  const tableCol = ref<any>([
    {
      label: '#',
      prop: 'number',
      render: ({ row }) => {
        return (
          <router-link
            to={{ name: 'BlockInfo', params: { blockNumber: row.number } }}
            class='c-#30754B'
          >
            {row.number}
          </router-link>
        )
      }
    },
    {
      label: 'UserOps',
      prop: 'useropCount',
      align: 'right',
      render: ({ row }) => {
        return <number-show number={row.useropCount} />
      }
    },
    // {
    //   label: 'MEV',
    //   prop: 'mev',
    //   align: 'right',
    //   render: ({ row }) => {
    //     return <number-show number={row.mev} />
    //   }
    // },
    {
      label: 'Bundler Profits',
      prop: 'bundlerProfit',
      align: 'right',
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={'coin-' + choosingChain.value}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.bundlerProfit}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.bundlerProfitUsd}
                format='{&asymp;$}0,0.[000000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
      }
    }
    // {
    //   prop: 'profit',
    //   align: 'right',
    //   sortable: 'custom',
    //   headerRender: () => {
    //     return (
    //       <span>
    //         <span>Bundler Loss</span>
    //         <el-tooltip content='???' placement='top'>
    //           <svg-icon
    //             iconClass='question'
    //             class='ml-4px w-16px! h-16px!'
    //           ></svg-icon>
    //         </el-tooltip>
    //       </span>
    //     )
    //   },
    //   render: ({ row }) => {
    //     return (
    //       <div>
    //         <div class='mb-4px'>
    //           <svg-icon
    //             iconClass={'coin-' + choosingChain.value}
    //             class='w-16px! h-16px! mr-4px'
    //           ></svg-icon>
    //           <number-show number={row.fee_amount} class='fw-600' />
    //         </div>
    //         <div>
    //           <number-show
    //             number={row.fee}
    //             format='{&asymp;$}0,0.[00]'
    //             class='c-#93959C'
    //           />
    //         </div>
    //       </div>
    //     )
    //   }
    // },
    // {
    //   prop: 'profit',
    //   align: 'right',
    //   sortable: 'custom',
    //   headerRender: () => {
    //     return (
    //       <span>
    //         <span>MEV Profits</span>
    //         <el-tooltip content='???' placement='top'>
    //           <svg-icon
    //             iconClass='question'
    //             class='ml-4px w-16px! h-16px!'
    //           ></svg-icon>
    //         </el-tooltip>
    //       </span>
    //     )
    //   },
    //   render: ({ row }) => {
    //     return (
    //       <div>
    //         <div class='mb-4px'>
    //           <svg-icon
    //             iconClass={'coin-' + choosingChain.value}
    //             class='w-16px! h-16px! mr-4px'
    //           ></svg-icon>
    //           <number-show number={row.fee_amount} class='fw-600' />
    //         </div>
    //         <div>
    //           <number-show
    //             number={row.fee}
    //             format='{&asymp;$}0,0.[00]'
    //             class='c-#93959C'
    //           />
    //         </div>
    //       </div>
    //     )
    //   }
    // }
  ])
</script>

<template>
  <div>
    <div class="p-x-16px mb-16px">
      <svg-icon
        iconClass="block"
        class="w-24px! h-24px! mr-8px c-#60626A"
      ></svg-icon>
      <span class="fw-700 text-24px">AA Block List</span>
    </div>
    <my-card noPad v-loading="loading">
      <template #title>
        <number-show
          class="c-#60626a"
          :number="total"
          format="0,0"
          suffix=" block(s) found"
        ></number-show>
      </template>
      <template #right>
        <Pagination
          v-model:total="total"
          v-model:page="page"
          @update:page="handleQuery"
        />
      </template>
      <titan-table :data="list" :columns="tableCol"></titan-table>
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
