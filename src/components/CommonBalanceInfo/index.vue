<script setup lang="tsx">
  import { COLOR_LIST } from '@/enums'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { PieChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import VChart from 'vue-echarts'
  import { getUserBalance } from '@/api/modules/stat'
  import { useAbortRequest } from '@/hooks/useAbortRequest'
  const props = defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    address: {
      type: [Number, String],
      default: 0
    }
  })
  const loading = ref(false)
  const totalAmount = ref('0')
  use([CanvasRenderer, PieChart, TooltipComponent])

  async function getList() {
    if (!props.choosingChain) return
    try {
      loading.value = true
      const res = await getUserBalance(props.choosingChain, {
        address: props.address
      })
      list.value = res?.assetDetails || []
      totalAmount.value = res?.totalUsd || '0'
    } catch (error) {
      list.value = []
      totalAmount.value = ''
    } finally {
      loading.value = false
    }
  }
  const list = ref<any>([])
  const source = computed(() => {
    return list.value.map((item) => {
      return { name: item.symbol, value: item.percent }
    })
  })
  const option = computed(() => ({
    color: COLOR_LIST,
    tooltip: {
      trigger: 'item',
      valueFormatter: (val) => {
        return (val * 100).toFixed(2) + '%'
      }
    },

    series: [
      {
        name: 'Balance',
        type: 'pie',
        startAngle: 225,
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: source.value,
        label: {
          formatter(param) {
            return param.name + ' ' + param.percent + '%'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }))
  const tableCol = ref<any>([
    {
      minWidth: 90,
      render: ({ row, index }) => {
        const idx = index % COLOR_LIST.length
        const color = COLOR_LIST[idx]
        return (
          <div class='flex items-center gap-4px'>
            <span
              class='w-10px h-10px rd-100%'
              style={{ backgroundColor: color }}
            ></span>
            <number-show number={row.percent} format='0.[00]%' />
          </div>
        )
      }
    },
    {
      minWidth: 100,
      render: ({ row }) => {
        const img = row.tokenImage ? (
          <img src={row.tokenImage} class='max-w-100% max-h-100%'></img>
        ) : (
          ''
        )
        return (
          <div class='flex-center flex-wrap gap-4px'>
            <div class='w-32px h-32px rd-50% p-6px bg-#F5F5F5'>{img}</div>
            <span>{row.symbol}</span>
          </div>
        )
      }
    },
    {
      minWidth: 120,
      align: 'right',
      render: ({ row }) => {
        const amount = row.amount ? (
          <div class='mb-4px'>
            <number-show
              number={row.amount}
              class='fw-600'
              format='0,0.[000000]'
            />
          </div>
        ) : (
          ''
        )
        return (
          <div>
            {amount}
            <div>
              <number-show
                number={row.amountUsd}
                format='{&asymp;$}0,0.[000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
      }
    }
  ])
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
</script>

<template>
  <div v-loading="loading">
    <div
      class="flex flex-wrap gap-16px items-center justify-between px-16px py-16px b-t-1px b-solid b-#EDECEC"
    >
      <h3 class="text-18px c-#303030">Balance</h3>
    </div>
    <div class="flex justify-between flex-wrap p-16px">
      <div class="flex-1 h-350px self-center min-w-300px">
        <v-chart :option="option" :autoresize="true" />
      </div>
      <div class="flex-1 min-w-300px">
        <div class="w-100% rd-8px b-1px b-solid b-#edecec p-16px">
          <div
            class="flex justify-between items-center fw-700 pb-16px b-b-1px b-solid b-#EDECEC"
          >
            <span class="c-#93959C text-16px">Total</span>
            <number-show
              :number="totalAmount"
              format="$0,0.[000]"
              class="text-20px"
            ></number-show>
          </div>
          <titan-table
            ref="table"
            :data="list"
            :columns="tableCol"
            :options="{ showHeader: false }"
            class="balance-table"
          >
          </titan-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
