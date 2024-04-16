<script setup lang="ts">
  import CommonTxTable from '@/components/CommonTxTable/index.vue'
  defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    paymaster: {
      type: [Number, String],
      default: 0
    },
    coinIcon: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <CommonTxTable
    :choosingChain="choosingChain"
    :address="paymaster"
    :coinIcon="coinIcon"
  ></CommonTxTable>
</template>

<style lang="scss" scoped></style>
