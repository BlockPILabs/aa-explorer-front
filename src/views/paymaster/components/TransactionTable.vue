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
    }
  })
</script>

<template>
  <CommonTxTable
    :choosingChain="choosingChain"
    :address="paymaster"
  ></CommonTxTable>
</template>

<style lang="scss" scoped></style>
