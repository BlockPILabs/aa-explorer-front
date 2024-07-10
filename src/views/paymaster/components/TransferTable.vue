<script setup lang="ts">
  import CommonTransferTable from '@/components/CommonTransferTable/index.vue'
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
  <CommonTransferTable
    :choosingChain="choosingChain"
    :address="paymaster"
  ></CommonTransferTable>
</template>

<style lang="scss" scoped></style>
