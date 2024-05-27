<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { StatusMap } from '@/enums'
  import { getDeployedAccounts } from '@/api/modules/stat'
  import TargetsWrapper from '@/components/TargetsWrapper/index.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import { formatTime } from '@/utils/time-utils'
  const props = defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    factory: {
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
      const res = await getDeployedAccounts(
        props.choosingChain,
        props.factory,
        {
          perPage: 15,
          page: page.value
        }
      )
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
  const tableCol = ref<any>([
    {
      label: 'Address',
      prop: 'address',
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.address}
            class='c-#30754B'
            routeInfo={{
              name: 'AccountInfo',
              params: { account: row.address }
            }}
          />
        )
      }
    },
    {
      label: 'Deployment Time',
      prop: 'factoryTime',
      render: ({ row }) => {
        return <span>{formatTime(row.factoryTime, 'YYYY/MM/DD HH:mm')}</span>
      }
    },

    {
      label: 'UserOps',
      prop: 'userOpsNum',
      render: ({ row }) => {
        return <number-show number={row.userOpsNum}></number-show>
      }
    },
    {
      label: 'Balance',
      prop: 'totalBalanceUsd',
      align: 'right',
      render: ({ row }) => {
        return (
          <number-show
            number={row.totalBalanceUsd}
            format='{$}0,0.[000]'
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
        suffix=" address(es) found"
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
