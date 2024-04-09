<template>
  <v-chart class="chart" :option="option" :autoresize="true" />
</template>

<script setup>
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { LineChart } from 'echarts/charts'
  import {
    TooltipComponent,
    GridComponent,
    DatasetComponent
  } from 'echarts/components'
  import VChart from 'vue-echarts'

  use([
    CanvasRenderer,
    LineChart,
    TooltipComponent,
    GridComponent,
    DatasetComponent
  ])
  const props = defineProps({
    chartData: {
      type: Array,
      default: () => []
    }
  })
  const option = computed(() => ({
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => '$' + value
    },
    color: ['#89E493'],
    grid: {
      containLabel: true,
      left: 0,
      right: 5,
      bottom: 0,
      top: 20
    },
    dataset: {
      source: props.chartData
    },
    xAxis: [
      {
        type: 'time',
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#93959C'
        },
        axisLine: {
          lineStyle: {
            color: '#DBDCDD'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        splitLine: {
          show: true
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          formatter: (value) => {
            if (value >= 1000 * 1000) {
              return value / 1000 / 1000 + 'M'
            } else if (value >= 1000) {
              return value / 1000 + 'K'
            } else {
              return value
            }
          }
        }
      }
    ],
    series: [
      {
        type: 'line',
        smooth: true,
        name: 'Holding',
        encode: {
          x: 'time',
          y: 'value'
        },
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(137, 228, 147, 0.12)'
              },
              {
                offset: 1,
                color: 'rgba(137, 228, 147, 0)'
              }
            ]
          }
        }
      }
    ]
  }))
</script>
