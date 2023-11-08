<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  import SidebarItem from './SidebarItem.vue'
  import { useAppStore } from '@/store/modules/app'
  import variables from '@/styles/variables.module.scss'

  import path from 'path-browserify'
  import { isExternal } from '@/utils/index'

  const appStore = useAppStore()
  const currRoute = useRoute()
  const props = defineProps({
    menuList: {
      required: true,
      default: () => {
        return []
      },
      type: Array<any>
    },
    basePath: {
      type: String,
      required: true
    }
  })

  /**
   * 
   *
   * @param routePath 
   */
  function resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(props.basePath)) {
      return props.basePath
    }

    const fullPath = path.resolve(props.basePath, routePath) 
    return fullPath
  }
</script>
<template>
  <el-menu
    :default-active="currRoute.path"
    :collapse="!appStore.sidebar.opened"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.menuActiveText"
    :unique-opened="false"
    :collapse-transition="false"
    mode="vertical"
  >
    <sidebar-item
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      :base-path="resolvePath(route.path)"
      :is-collapse="!appStore.sidebar.opened"
    />
  </el-menu>
</template>
