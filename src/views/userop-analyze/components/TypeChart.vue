<script setup lang="ts">
  import { COLOR_LIST } from '@/enums'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { PieChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import VChart from 'vue-echarts'
  import { getUseropType } from '@/api/modules/stat'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  use([CanvasRenderer, PieChart, TooltipComponent])

  function circleStyle(idx) {
    const index = idx % COLOR_LIST.length
    return {
      backgroundColor: COLOR_LIST[index]
    }
  }
  const list = ref<any>([{}])
  const source = computed(() => {
    return list.value.map((item) => {
      return { name: item.userOpType, value: item.rate }
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
        name: 'UserOp type',
        type: 'pie',
        startAngle: 225,
        radius: ['40%', '70%'],
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
  const loading = ref(false)
  async function getList() {
    try {
      loading.value = true
      const res = await getUseropType(choosingChain.value, {
        timeRange: 'd30'
      })
      list.value = res?.UserOpTypes || []
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
      <span class="fw-700 text-18px">UserOp Type</span>
    </template>
    <div class="flex justify-between flex-wrap">
      <div class="flex-shrink-0 w-300px">
        <div
          v-for="(item, index) in source"
          class="text-16px flex items-center rd-8px px-16px py-8px mb-8px bg-#F8F8F8"
        >
          <span
            class="w-12px h-12px rd-50% mr-8px"
            :style="circleStyle(index)"
          ></span>
          <span>{{ item.name }}</span>
          <number-show
            :number="item.value"
            format="0.[00]%"
            class="fw-600 ml-auto"
          ></number-show>
        </div>
      </div>
      <div class="flex-1 h-280px self-center min-w-300px">
        <v-chart :option="option" :autoresize="true" />
      </div>
    </div>
  </my-card>
</template>

<style lang="scss" scoped></style>
