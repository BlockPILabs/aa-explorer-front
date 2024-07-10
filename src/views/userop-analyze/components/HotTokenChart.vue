<script setup lang="ts">
  import { COLOR_LIST } from '@/enums'
  import { getHotToken } from '@/api/modules/stat'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { TreemapChart } from 'echarts/charts'
  import { TooltipComponent } from 'echarts/components'
  import VChart from 'vue-echarts'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)

  use([CanvasRenderer, TreemapChart, TooltipComponent])
  const list = ref<any>([{}])
  const source = computed(() => {
    return list.value.map((item) => {
      return { name: item.tokenSymbol, value: item.count }
    })
  })
  const option = computed(() => ({
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
  }))

  const loading = ref(false)
  async function getHotAAToken() {
    try {
      loading.value = true
      const res = await getHotToken(choosingChain.value)
      list.value = res?.tokenDetails || []
    } catch (error) {
      list.value = []
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getHotAAToken()
  })
</script>

<template>
  <my-card class="mt-16px" v-loading="loading">
    <template #title>
      <span class="fw-700 text-18px">Hot AA Txn Token</span>
    </template>
    <div class="flex-1 h-350px">
      <v-chart :option="option" :autoresize="true" />
    </div>
  </my-card>
</template>

<style lang="scss" scoped></style>
