<script setup lang="ts">
  import { COLOR_LIST } from '@/enums'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { PieChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import VChart from 'vue-echarts'
  import { pureFormatNumber } from '@/components/NumberShow/pure-format'
  use([CanvasRenderer, PieChart, TooltipComponent])
  const props = defineProps({
    dataSource: {
      type: Array,
      default: []
    },
    total: {
      type: Number,
      default: 0
    }
  })
  const source = computed(() => {
    return props.dataSource.map((item: any) => {
      return {
        name: item.symbol,
        value: item.amountUsd,
        rate: item.percent
      }
    })
  })

  const option = computed(() => ({
    color: COLOR_LIST,
    tooltip: {
      trigger: 'item'
    },

    series: [
      {
        name: 'My Wallet Balance',
        type: 'pie',
        startAngle: 225,
        radius: ['50%', '90%'],
        center: ['50%', '50%'],
        data: source.value,
        label: {
          position: 'center',
          formatter: [
            `{a|$${pureFormatNumber(props.total, '0.[000]a')}}`,
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
</script>

<template>
  <div class="w-100% h-200px mb-24px">
    <v-chart :option="option" :autoresize="true" />
  </div>
</template>

<style lang="scss" scoped></style>
