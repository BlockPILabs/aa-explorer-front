<script setup lang="ts">
  import Logo from './Logo.vue'
  import NavRight from './NavRight.vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/store/modules/app'
  const appStore = useAppStore()
  const { sidebar } = storeToRefs(appStore)
  const { opened } = toRefs(sidebar.value)
  function toggleSideBar() {
    appStore.toggleSidebar(false)
  }
  defineProps({
    showChain: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div
    class="navbar bg-#fff h-80px flex items-center justify-between px-16px flex-wrap"
  >
    <div class="flex">
      <hamburger
        :is-active="opened"
        @toggle-click="toggleSideBar"
        v-show="appStore.device !== 'mobile'"
      />
      <logo />
    </div>

    <div class="flex">
      <nav-right :show-chain="showChain" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .navbar {
    box-shadow: 0 0 1px #0003;
  }
</style>
