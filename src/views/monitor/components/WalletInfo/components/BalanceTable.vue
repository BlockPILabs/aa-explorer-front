<script setup lang="tsx">
  import { COLOR_LIST } from '@/enums'

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
        const img = row.tokenUrl ? (
          <img src={row.tokenUrl} class='max-w-100% max-h-100%'></img>
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
</script>

<template>
  <div class="w-100% rd-8px b-1px b-solid b-#edecec p-16px">
    <div
      class="flex justify-between items-center fw-700 pb-16px b-b-1px b-solid b-#EDECEC"
    >
      <span class="c-#93959C text-16px">Total</span>
      <number-show
        :number="props.total"
        format="$0,0.[000]"
        class="text-20px"
      ></number-show>
    </div>
    <titan-table
      ref="table"
      :data="props.dataSource"
      :columns="tableCol"
      :options="{ showHeader: false }"
      class="balance-table"
    >
    </titan-table>
  </div>
</template>

<style lang="scss" scoped>
  .balance-table.titan-table {
    :deep() {
    }
  }
</style>
