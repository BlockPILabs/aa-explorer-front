<template>
  <span class="number-show"> {{ formatNumber }}{{ suffix }} </span>
</template>

<script lang="ts" setup>
  import numbro from 'numbro'

  const props = defineProps({
    number: {
      type: [String, Number],
      default: 0
    },
    format: {
      type: [String, Object],
      default: '0,0'
    },
    suffix: {
      type: String,
      default: ''
    },
    roundingFunction: {
      type: Function,
      default: Math.floor
    }
  })

  const lastFormat = computed(() => {
    if (props.format === '0,0') {
      return {
        thousandSeparated: true,
        trimMantissa: true,
        mantissa: 0
      }
    } else {
      return props.format
    }
  })

  const formatNumber = computed(() => {
    const roundingFn = (num: number) => {
      return props.roundingFunction(num)
    }

    numbro.setDefaults({
      roundingFunction: roundingFn
    })

    return numbro(props.number).format(lastFormat.value) as string
  })
</script>
