<template>
  <div
    class="my-card bg-#fff rd-12px w-100% flex flex-col"
    :class="{ 'no-padding-card': noPad, 'has-header-border': headBorder }"
  >
    <div
      class="my-card__header min-h-69px px-16px py-16px flex gap-16px items-center justify-between flex-wrap"
    >
      <div class="my-card__title of-hidden">
        <slot name="title"></slot>
      </div>
      <div class="my-card__right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="my-card__body flex-1 px-16px pb-16px relative">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    noPad: {
      type: Boolean,
      default: false
    },
    headBorder: {
      type: Boolean,
      default: false
    }
  })
</script>

<style lang="scss" scoped>
  .my-card {
    &.no-padding-card {
      .my-card__body {
        padding-left: 0px;
        padding-right: 0px;
      }
    }
    &.has-header-border {
      .my-card__header {
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
</style>
