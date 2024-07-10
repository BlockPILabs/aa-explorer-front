<script setup lang="ts">
  import CommonBalanceInfo from '@/components/CommonBalanceInfo/index.vue'
  defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    paymaster: {
      type: [Number, String],
      default: 0
    }
  })
</script>

<template>
  <CommonBalanceInfo
    :choosingChain="choosingChain"
    :address="paymaster"
  ></CommonBalanceInfo>
</template>

<style lang="scss" scoped></style>
