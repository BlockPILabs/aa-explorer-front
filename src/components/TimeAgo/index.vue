<script setup lang="ts">
  import { calcDiffTimePast } from '@/utils/time-utils'
  const props = defineProps({
    time: {
      type: Number,
      default: undefined
    },
    suffix: {
      type: String,
      default: ''
    }
  })
  const timeAgo = ref('')
  function getTimeAgo() {
    if (!props.time) {
      timeAgo.value = '-'
      return
    }
    timeAgo.value = calcDiffTimePast(props.time) + props.suffix
    useTimeoutFn(() => {
      getTimeAgo()
    }, 1000)
  }
  watch(
    () => props.time,
    () => {
      getTimeAgo()
    },
    {
      immediate: true
    }
  )
</script>

<template>
  <span>{{ timeAgo }}</span>
</template>

<style lang="scss" scoped></style>
