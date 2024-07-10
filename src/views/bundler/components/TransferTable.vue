<script setup lang="ts">
  import CommonTransferTable from '@/components/CommonTransferTable/index.vue'
  defineProps({
    choosingChain: {
      type: String,
      default: ''
    },
    bundler: {
      type: [Number, String],
      default: 0
    }
  })
</script>

<template>
  <CommonTransferTable
    :choosingChain="choosingChain"
    :address="bundler"
  ></CommonTransferTable>
</template>

<style lang="scss" scoped></style>
