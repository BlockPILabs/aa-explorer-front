<script setup lang="ts">
  import { COLOR_LIST } from '@/enums'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { PieChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import VChart from 'vue-echarts'
  import { pureFormatNumber } from '@/components/NumberShow/pure-format'
  import { getContractInteract } from '@/api/modules/stat'
  import { formatHash } from '@/utils/formatHash'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  use([CanvasRenderer, PieChart, TooltipComponent])
  const list = ref<any>([{}])
  const source = computed(() => {
    return list.value.map((item) => {
      return {
        name: item.contractAddress,
        value: item.singleNum,
        rate: item.rate
      }
    })
  })
  const totalAmount = ref(0)
  function circleStyle(idx) {
    const index = idx % COLOR_LIST.length
    return {
      backgroundColor: COLOR_LIST[index]
    }
  }
  const option = computed(() => ({
    color: COLOR_LIST,
    tooltip: {
      trigger: 'item'
    },

    series: [
      {
        name: 'AA Contract Interaction',
        type: 'pie',
        startAngle: 225,
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: source.value,
        label: {
          position: 'center',
          formatter: [
            `{a|${pureFormatNumber(totalAmount.value, '0.[00]a')}}`,
            '{b|Total}'
          ].join('\n'),
          rich: {
            a: {
              color: '#303030',
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: 'Barlow'
            },
            b: {
              color: '#60626A',
              padding: [4, 0, 0, 0],
              fontFamily: 'Barlow'
            }
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
  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getContractInteract(choosingChain.value, {
        timeRange: 'd30'
      })
      list.value = res?.AAContractInteract || []
      totalAmount.value = res?.totalNum || 0
    } catch (error) {
      list.value = []
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
  <my-card class="mt-16px" v-loading="loading">
    <template #title>
      <span class="fw-700 text-18px">AA Contract Interaction</span>
    </template>
    <div class="flex justify-between flex-wrap items-center">
      <div class="flex-1 h-350px min-w-240px">
        <v-chart :option="option" :autoresize="true" />
      </div>
      <div class="flex-shrink-0 w-214px">
        <div
          v-for="(item, index) in source"
          class="text-16px flex items-center py-8px mb-8px"
        >
          <span
            class="w-12px h-12px rd-50% mr-8px"
            :style="circleStyle(index)"
          ></span>
          <el-tooltip :content="item.name" placement="top" :show-after="800">
            <span class="fw-400">{{ formatHash(item.name || '', 5, 5) }}</span>
          </el-tooltip>
          <number-show
            :number="item.rate"
            format="0.[00]%"
            class="fw-600 ml-auto"
          ></number-show>
        </div>
      </div>
    </div>
  </my-card>
</template>

<style lang="scss" scoped></style>
