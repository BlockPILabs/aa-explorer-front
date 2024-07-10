<script setup lang="ts">
  import CommonTransferTable from '@/components/CommonTransferTable/index.vue'
  defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    account: {
      type: [Number, String],
      default: 0
    }
  })
</script>

<template>
  <CommonTransferTable
    :choosingChain="choosingChain"
    :address="account"
  ></CommonTransferTable>
</template>

<style lang="scss" scoped></style>
