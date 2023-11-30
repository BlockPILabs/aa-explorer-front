<template>
  <v-chart class="chart" :option="option" :autoresize="true" />
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/store/modules/app'
  import { getOffset, formatTime } from '@/utils/time-utils'
  import { pureFormatNumber } from '@/components/NumberShow/pure-format'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { BarChart, LineChart } from 'echarts/charts'
  import {
    TooltipComponent,
    GridComponent,
    DatasetComponent
  } from 'echarts/components'
  import VChart from 'vue-echarts'

  use([
    CanvasRenderer,
    BarChart,
    LineChart,
    TooltipComponent,
    GridComponent,
    DatasetComponent
  ])
  const props = defineProps({
    chartData: {
      type: Array,
      default: () => []
    },
    network: {
      type: String,
      default: ''
    }
  })
  const appStore = useAppStore()

  const { device } = storeToRefs(appStore)
  const isMobile = computed(() => {
    return device.value === 'mobile'
  })
  const option = computed(() => {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return `<div style="margin: 0px 0 0; font-family: Barlow; line-height: normal;">
    <div style="margin: 0px 0 0; ">
      <div
        style="color: #303030;"
      >
        ${formatTime(params[0].axisValue)}(UTC${getOffset()})
      </div>
      <div style="margin: 10px 0 0; ">
        <div style="margin: 0px 0 0; ">
          <div style="margin: 0px 0 0; ">
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                border-radius: 10px;
                width: 10px;
                height: 10px;
                background-color: #1379ff;
              "
            ></span
            ><span
              style="
                font-size: 14px;
                color: #93959C;
                
                margin-left: 2px;
              "
              >UserOps</span
            ><span
              style="
                float: right;
                margin-left: 20px;
                font-size: 14px;
                color: #303030;
                font-weight: 600;
              "
              >${pureFormatNumber(
                params[0].value['userOpsNum'],
                '0.[00]a'
              )}</span
            >
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="margin: 10px 0 0; ">
          <div style="margin: 0px 0 0; ">
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                border-radius: 10px;
                width: 10px;
                height: 10px;
                background-color: #e6d64d;
              "
            ></span
            ><span
              style="
                font-size: 14px;
                color: #93959C;
                
                margin-left: 2px;
              "
              >Account Created</span
            ><span
              style="
                float: right;
                margin-left: 20px;
                font-size: 14px;
                color: #303030;
                font-weight: 600;
              "
              >${pureFormatNumber(
                params[0].value['activeAAWallet'],
                '0.[00]a'
              )}</span
            >
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="margin: 10px 0 0; ">
          <div style="margin: 0px 0 0; ">
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                border-radius: 10px;
                width: 10px;
                height: 10px;
                background-color: #6ac8fd;
              "
            ></span
            ><span
              style="
                font-size: 14px;
                color: #93959C;
                
                margin-left: 2px;
              "
              >Accumulative Gas Fee</span
            ><span
              style="
                float: right;
                margin-left: 20px;
                font-size: 14px;
                color: #303030;
                font-weight: 600;
              "
              >
              <svg aria-hidden="true" class="svg-icon gas-icon" style="width: 16px; height: 16px;"><use xlink:href="#icon-coin-${
                props.network
              }"></use></svg>
              <span style="margin: 0 2px;">${pureFormatNumber(
                params[0].value['accumulativeGasFee'],
                '0.[00]a'
              )}</span>
              <span style="color: #60626A;font-weight: 500;">$${pureFormatNumber(
                params[0].value['accumulativeGasFeeUsd'],
                '0.[00]a'
              )}</span>
              </span
            >
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="margin: 10px 0 0; ">
          <div style="margin: 0px 0 0; ">
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                border-radius: 10px;
                width: 10px;
                height: 10px;
                background-color: #ff82f2;
              "
            ></span
            ><span
              style="
                font-size: 14px;
                color: #93959C;
                
                margin-left: 2px;
              "
              >Paymaster Gas Sponsored</span
            ><span
              style="
                float: right;
                margin-left: 20px;
                font-size: 14px;
                color: #303030;
                font-weight: 600;
              "
              >
              <svg aria-hidden="true" class="svg-icon gas-icon" style="width: 16px; height: 16px;"><use xlink:href="#icon-coin-${
                props.network
              }"></use></svg>
              <span style="margin: 0 2px;">${pureFormatNumber(
                params[0].value['paymasterGasPaid'],
                '0.[00]a'
              )}</span>
              <span style="color: #60626A;font-weight: 500;">$${pureFormatNumber(
                params[0].value['paymasterGasPaidUsd'],
                '0.[00]a'
              )}</span>
              </span
            >
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="margin: 10px 0 0; ">
          <div style="margin: 0px 0 0; ">
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                border-radius: 10px;
                width: 10px;
                height: 10px;
                background-color: #89e493;
              "
            ></span
            ><span
              style="
                font-size: 14px;
                color: #93959C;
                
                margin-left: 2px;
              "
              >Bundler Gas Profit</span
            >
            
            <span
              style="
                float: right;
                margin-left: 20px;
                font-size: 14px;
                color: #303030;
                font-weight: 600;
              "
              >
              <svg aria-hidden="true" class="svg-icon gas-icon" style="width: 16px; height: 16px;"><use xlink:href="#icon-coin-${
                props.network
              }"></use></svg>
              <span style="margin: 0 2px;">${pureFormatNumber(
                params[0].value['bundlerGasProfit'],
                '0.[00]a'
              )}</span>
              <span style="color: #60626A;font-weight: 500;">$${pureFormatNumber(
                params[0].value['bundlerGasProfitUsd'],
                '0.[00]a'
              )}</span>
              </span
            >
            <div style="clear: both"></div>
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="clear: both"></div>
      </div>
      <div style="clear: both"></div>
    </div>
    <div style="clear: both"></div>
  </div>`
        }
      },
      color: ['#1379FF', '#E6D64D', '#6AC8FD', '#FF82F2', '#89E493'],
      grid: {
        containLabel: true,
        left: isMobile.value ? 40 : 100,
        right: isMobile.value ? 40 : 100,
        bottom: 10,
        top: 20
      },
      dataset: {
        source: props.chartData
      },
      xAxis: [
        {
          type: 'time',
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
          name: 'Count',
          nameRotate: 90,
          nameGap: 50,
          nameLocation: 'center',
          splitLine: {
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
        },
        {
          type: 'value',
          name: 'Gas',
          nameRotate: -90,
          nameGap: 50,
          nameLocation: 'center',
          scale: true,
          splitLine: {
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
          type: 'bar',
          yAxisIndex: 0,
          name: 'UserOps',
          encode: {
            x: 'time',
            y: 'userOpsNum'
          }
        },
        {
          type: 'bar',
          barMaxWidth: '10px',
          yAxisIndex: 0,
          name: 'Active AA Wallet',
          encode: {
            x: 'time',
            y: 'activeAAWallet'
          }
        },
        {
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          name: 'Accumulative Gas Fee',
          symbol: 'none',
          encode: {
            x: 'time',
            y: 'accumulativeGasFee'
          }
        },
        {
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          name: 'Paymaster Gas Paid',
          symbol: 'none',
          encode: {
            x: 'time',
            y: 'paymasterGasPaid'
          }
        },
        {
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          name: 'Bundler Gas Profit',
          symbol: 'none',
          encode: {
            x: 'time',
            y: 'bundlerGasProfit'
          }
        }
      ]
    }
  })
</script>
