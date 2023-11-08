<script lang="ts" setup>
  import { watchEffect } from 'vue'
  import { useWindowSize } from '@vueuse/core'
  import { AppMain } from './components/index'

  import { useAppStore } from '@/store/modules/app'
  const { width } = useWindowSize()

  /**
   *
   *>=1200px
   * >=992px
   * >=768px
   */
  const WIDTH = 992

  const appStore = useAppStore()

  watchEffect(() => {
    if (width.value < WIDTH) {
      appStore.toggleDevice('mobile')
      appStore.closeSideBar(false)
    } else {
      appStore.toggleDevice('desktop')

      if (width.value >= 1200) {
        appStore.openSideBar(false)
      } else {
        appStore.closeSideBar(false)
      }
    }
  })
</script>
<template>
  <div class="main-container">
    <app-main />
  </div>
</template>
