<script setup lang="tsx">
  import { useRouteQuery } from '@vueuse/router'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { MEVTypeMap } from '@/enums'
  import { getBlockMevs } from '@/api/modules/stat'
  import Pagination from '@/components/Pagination/index.vue'
  import { getOffset, formatTime } from '@/utils/time-utils'
  import { useAbortRequest } from '@/hooks/useAbortRequest'
  import { capitalize } from 'lodash-es'
  import { SORT_FIELD_MAP, TABLE_SORT_MAP } from '@/enums/SortMap'
  const props = defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    blockNumber: {
      type: [Number, String],
      default: 0
    },
    coinIcon: {
      type: String,
      default: ''
    }
  })
  const sortField = ref('')
  const sortOrder = ref('')
  const page = useRouteQuery('page', 1, { transform: Number })
  function handleQuery() {
    getList()
  }
  const total = ref(0)
  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getBlockMevs(props.choosingChain, {
        perPage: 10,
        page: page.value,
        blockNumber: props.blockNumber,
        sort: SORT_FIELD_MAP.blockMevList[sortField.value] || '',
        order: TABLE_SORT_MAP[sortOrder.value] || ''
      })
      list.value = (res.records || []).map((item) => {
        item.visible = false
        return item
      })
      total.value = res.totalCount
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([])
  onActivated(() => {
    getList()
  })
  useAbortRequest()
  const tableCol = ref<any>([
    {
      label: `Timestamp(UTC${getOffset()})`,
      prop: 'timestamp',
      minWidth: 150,
      render: ({ row }) => {
        return <span>{formatTime(row.timestamp, 'YYYY/MM/DD HH:mm')}</span>
      }
    },
    {
      label: 'UserOp Hash',
      prop: 'userOpHash',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.userOpHash}
            class='c-#30754B'
            routeInfo={{
              name: 'UseropInfo',
              params: { userop: row.userOpHash },
              query: { tx: row.txHash }
            }}
          />
        )
      }
    },
    {
      label: 'MEV Type',
      prop: 'mevType',
      minWidth: 120,
      render: ({ row }) => {
        const color = MEVTypeMap[row.mevType]?.color || '#5D55F0'
        const bgColor = MEVTypeMap[row.mevType]?.bg || '#F0F5FF'
        return (
          <div
            class='inline-flex py-2px px-4px items-center gap-4px rd-4px'
            style={{ color: color, backgroundColor: bgColor }}
          >
            <svg-icon
              iconClass={`home-${MEVTypeMap[row.mevType]?.icon || 'frontrun'}`}
              class='w-16px! h-16px!'
            ></svg-icon>
            <span>{MEVTypeMap[row.mevType]?.label || ''}</span>
          </div>
        )
      }
    },
    {
      label: 'Victim',
      prop: 'victim',
      minWidth: 150,
      render: ({ row }) => {
        let routeInfo = {}
        if (row.victimType === 'bundler') {
          routeInfo = {
            name: 'BundlerInfo',
            params: { bundler: row.victim }
          }
        } else {
          routeInfo = {
            name: 'AccountInfo',
            params: { account: row.victim }
          }
        }
        return (
          <div class='inline-flex flex-col items-start gap-4px'>
            <CopyMe hash={row.victim} class='c-#30754B' routeInfo={routeInfo} />
            <span class='c-#fff px-4px py-2px rd-4px bg-#6EA7E9'>
              {capitalize(row.victimType)}
            </span>
          </div>
        )
      }
    },

    {
      label: 'Attacker',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.attacker}
            class='c-#30754B'
            routeInfo={{
              name: 'BundlerInfo',
              params: { bundler: row.attacker }
            }}
          />
        )
      }
    },
    {
      label: 'Bundler Loss',
      prop: 'bundlerLoss',
      align: 'right',
      sortable: 'custom',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={props.coinIcon}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.bundlerLoss}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.bundlerLossInUsd}
                format='{&asymp;$}0,0.[000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
      }
    },
    {
      label: 'MEV Profits',
      prop: 'mevProfits',
      align: 'right',
      sortable: 'custom',
      minWidth: 150,
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={props.coinIcon}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.mevProfits}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.mevProfitsInUsd}
                format='{&asymp;$}0,0.[000]'
                class='c-#93959C'
              />
            </div>
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
        suffix=" UserOp(s) found"
      ></number-show>
      <Pagination
        v-model:total="total"
        v-model:page="page"
        :limit="10"
        @update:page="handleQuery"
      />
    </div>
    <titan-table
      :data="list"
      :columns="tableCol"
      @sort-change="handleSortChange"
    ></titan-table>
    <div class="flex justify-end px-16px pt-16px">
      <Pagination
        v-model:total="total"
        v-model:page="page"
        :limit="10"
        @update:page="handleQuery"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
