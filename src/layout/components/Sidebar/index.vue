<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import LeftMenu from './LeftMenu.vue'
  import { useAppStore } from '@/store/modules/app'
  import { usePermissionStore } from '@/store/modules/permission'
  import { useChainStore } from '@/store/modules/chain'
  import ChainDialog from './ChainDialog.vue'
  const permissionStore = usePermissionStore()
  const appStore = useAppStore()
  const chainStore = useChainStore()
  const { sidebar } = storeToRefs(appStore)
  const { opened } = toRefs(sidebar.value)
  const contacts = reactive([
    { icon: 'twitter', url: 'https://twitter.com/RealBlockPI' },
    { icon: 'telegram', url: 'https://t.me/blockpidaily' },
    { icon: 'discord', url: 'https://discord.gg/xTvGVrGVZv' },
    { icon: 'medium', url: 'https://medium.com/@blockpi' }
  ])

  const report = reactive({
    icon: 'bug',
    text: 'Bug report',
    url: 'https://discord.com/channels/900985418202365982/901031135927226399'
  })

  const { choosingChain, choosingChainObj } = storeToRefs(chainStore)
  const chainName = computed(() => {
    return choosingChainObj.value.chainName
  })
  const chainType = computed(() => {
    return choosingChainObj.value.name
  })
  const showChoose = ref(false)

  function changeChain() {
    showChoose.value = true
  }
</script>

<template>
  <div class="menu-wrap flex flex-col">
    <div
      class="chain-box flex flex-col items-center flex-shrink-0 pt-32px pb-16px px-8px"
    >
      <div
        class="chain-logo w-88px h-88px flex items-center justify-center cursor-pointer"
        :class="{ 'is-compressed': !opened }"
        @click="changeChain"
      >
        <svg-icon
          :icon-class="`chain-${choosingChain}`"
          class="chain-icon"
        ></svg-icon>
      </div>
      <div
        class="current-chain cursor-pointer flex items-center mt-10px"
        v-if="opened"
        @click="changeChain"
      >
        <div class="flex flex-col items-center mr-8px">
          <strong class="text-18px">{{ chainName }}</strong>
          <span class="c-#60626A text-12px">{{ chainType }}</span>
        </div>
        <svg-icon icon-class="expand" />
      </div>
      <ChainDialog v-model:visible="showChoose"></ChainDialog>
    </div>
    <el-scrollbar class="px-8px pt-16px pb-32px flex-grow-1">
      <LeftMenu :menu-list="permissionStore.routes" base-path="" />

      <div class="contact-us mt-auto pt-24px">
        <a
          class="bug-report block text-center px-8px py-7px c-#93959c group bg-#F8F8F8 hover:c-#60626a rd-8px"
          target="_blank"
          :href="report.url"
        >
          <svg-icon
            :icon-class="report.icon"
            class="bug-icon c-#b8bac1 mr-8px group-hover:c-#93959c"
          />
          <span v-if="opened">{{ report.text }}</span>
        </a>
        <div
          class="flex flex-wrap items-center justify-center my-16px contact-links"
        >
          <a
            v-for="item in contacts"
            :key="item.icon"
            :href="item.url"
            class="contact-link flex items-center justify-center w-32px h-32px mr-16px b-rd-50% last:mr-0 group hover:bg-#edecec"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg-icon
              :icon-class="item.icon"
              class="contact-icon c-#b8bac1 group-hover:c-#93959c"
            />
          </a>
        </div>
        <div class="copyright text-12px c-#B8BAC1" v-if="opened">
          <span>&copy;2023 BlockPI.All rights reserved.</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<style lang="scss" scoped>
  .chain-box {
    border-bottom: 1px solid #f6f7f2;
    .chain-logo {
      background: url('../../../assets/icons/hexgon.svg') no-repeat center
        center;
      background-size: 100% auto;
      .chain-icon {
        width: 48px;
        height: 48px;
      }
      &.is-compressed {
        width: 48px;
        height: 48px;
        .chain-icon {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
  .contact-us {
    border-top: 1px solid #f6f7f2;
  }
  .bug-icon {
    width: 16px;
    height: 16px;
  }
  .contact-icon {
    width: 20px;
    height: 20px;
  }
  :deep(.el-scrollbar) {
    .el-scrollbar__view {
      display: flex;
      width: 100%;
      min-height: 100%;
      flex-direction: column;
    }
  }
</style>
