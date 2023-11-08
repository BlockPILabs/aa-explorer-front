<script setup lang="ts">
  import DetailMain from './DetailMain.vue'
  import { Navbar } from './components/index'

  import { computed } from 'vue'

  import { useAppStore } from '@/store/modules/app'

  const appStore = useAppStore()

  const classObj = computed(() => ({
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: appStore.device === 'mobile'
  }))

  function handleOutsideClick() {
    appStore.closeSideBar(false)
  }
</script>

<template>
  <div :class="classObj" class="app-wrapper detail-app-wrapper">
    <div
      v-if="classObj.mobile && classObj.openSidebar"
      class="drawer-bg"
      @click="handleOutsideClick"
    ></div>
    <div class="fixed-header">
      <navbar show-chain />
    </div>
    <DetailMain />
  </div>
</template>

<style lang="scss" scoped>
  .app-wrapper {
    &::after {
      display: table;
      clear: both;
      content: '';
    }

    position: relative;
    width: 100%;
    height: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
    &.detail-app-wrapper {
      :deep() {
        .navbar {
          .menu-switcher {
            display: none !important;
          }
        }
      }
    }
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1002;
    width: 100%;
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .drawer-bg {
    position: absolute;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
  }
</style>
