<script setup lang="ts">
  import { COLOR_LIST } from '@/enums'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { TreemapChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import VChart from 'vue-echarts'

  use([CanvasRenderer, TreemapChart, TooltipComponent])
  const source = ref([
    { name: 'WETH', value: 5884 },
    { name: 'USDC', value: 5844 },
    { name: 'USDT', value: 5125 },
    { name: 'BAD', value: 2009 },
    { name: 'DAI', value: 1265 },
    { name: 'MATIC', value: 888 },
    { name: 'RLB', value: 500 },
    { name: 'PEPE', value: 120 }
  ])
  const option = ref({
    color: COLOR_LIST,
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Hot AA txn token',
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: {
          show: false
        },
        data: source.value,
        label: {
          fontSize: '16px'
        }
      }
    ]
  })
</script>

<template>
  <my-card class="mt-16px">
    <template #title>
      <span class="fw-700 text-18px">Hot AA Txn Token</span>
    </template>
    <!-- <div class="flex-1 h-350px">
      <v-chart :option="option" :autoresize="true" />
    </div> -->
    <div class="flex flex-col items-center justify-center h-350px">
      <svg-icon
        iconClass="coming_soon"
        class="w-64px! h64px! mb-24px"
      ></svg-icon>
      <span>Coming soon</span>
    </div>
  </my-card>
</template>

<style lang="scss" scoped></style>
