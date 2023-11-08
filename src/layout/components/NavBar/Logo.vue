<script lang="ts" setup>
  import { getAssets } from '@/utils'
</script>

<template>
  <div class="w-full h-80px logo-wrap">
    <router-link
      key="expand"
      class="h-full w-full flex items-center justify-center"
      to="/"
    >
      <svg-icon iconClass="logo" class="web-logo"></svg-icon>
      <div class="ml-8px">
        <span class="text-20px fw-700 lh-none">AA Explorer</span>
        <br />
        <span class="text-14px c-#60626a">
          <svg-icon iconClass="flash" class="mr-4px"></svg-icon>
          <span>Powered by</span>
          <span class="fw-700"> BlockPI</span>
        </span>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
  .web-logo {
    width: 48px;
    height: 48px;
  }
</style>
