<script setup lang="ts">
  import CommonTxTable from '@/components/CommonTxTable/index.vue'
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
  <CommonTxTable
    :choosingChain="choosingChain"
    :address="bundler"
  ></CommonTxTable>
</template>

<style lang="scss" scoped></style>
