<template>
  <div class="nav-right flex items-center">
    <template v-if="!isMobile">
      <div class="filter w-377px">
        <search-hash></search-hash>
      </div>
      <!-- <a
        href="https://docs.blockpi.io"
        class="docs-link text-16px ml-24px c-#93959C hover:c-#303030"
        >Docs</a
      > -->
    </template>
    <template v-else>
      <div
        class="chain-logo w-32px h-32px mr-10px flex items-center justify-center cursor-pointer"
        @click="changeChain"
      >
        <svg-icon
          :icon-class="`chain-${choosingChain}`"
          class="chain-icon w-20px! h-20px!"
        ></svg-icon>
      </div>
      <svg-icon
        iconClass="search"
        class="w-20px! h-20px! mr-10px cursor-pointer"
        @click="ToggleSearch"
      />
      <svg-icon
        iconClass="hamburger"
        class="w-20px! h-20px! cursor-pointer c-#303030"
        @click="toggleSideBar"
      />
      <transition name="slideTTB">
        <div
          v-if="showSearch"
          class="px-16px py-8px w-full fixed top-80px left-0px"
        >
          <search-hash></search-hash>
        </div>
      </transition>
      <ChainDialog v-model:visible="showChoose"></ChainDialog>
    </template>
  </div>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/store/modules/app'
  import SearchHash from '@/components/SearchHash/index.vue'
  import { useChainStore } from '@/store/modules/chain'
  import ChainDialog from '../Sidebar/ChainDialog.vue'

  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  defineProps({
    showChain: {
      type: Boolean,
      default: false
    }
  })
  const appStore = useAppStore()

  const { device } = storeToRefs(appStore)
  const isMobile = computed(() => {
    return device.value === 'mobile'
  })
  function toggleSideBar() {
    appStore.toggleSidebar(false)
  }
  const showSearch = ref(false)
  function ToggleSearch() {
    showSearch.value = !showSearch.value
  }
  const showChoose = ref(false)

  function changeChain() {
    showChoose.value = true
  }
</script>
<style lang="scss" scoped>
  .chain-logo {
    background: url('../../../assets/icons/hexgon.svg') no-repeat center center;
    background-size: 100% auto;
  }
</style>
<style lang="scss">
  .slideTTB-enter-active,
  .slideTTB-leave-active {
    transition: all 0.5s ease;
    transform: translateY(0px);
  }

  .slideTTB-enter-from,
  .slideTTB-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
</style>
