<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import path from 'path-browserify'
  import { isExternal } from '@/utils/index'
  import AppLink from './Link.vue'

  import SvgIcon from '@/components/SvgIcon/index.vue'
  import { useRoute } from 'vue-router'
  import { useAppStore } from '@/store/modules/app'
  import { useWalletStore } from '@/store/modules/wallet'
  const appStore = useAppStore()
  const { sidebar } = storeToRefs(appStore)
  const { opened } = toRefs(sidebar.value)
  const walletStore = useWalletStore()
  const { hasSigned } = storeToRefs(walletStore)
  const route = useRoute()
  const currentPath = computed(() => {
    return route.path
  })

  const props = defineProps({
    item: {
      type: Object,
      required: true
    },

    basePath: {
      type: String,
      required: true
    }
  })

  const onlyOneChild = ref()

  /**
   *
   *
   * @param children
   * @param parent
   */
  function hasOneShowingChild(children = [], parent: any) {
    const showingChildren = children.filter((item: any) => {
      if (item.meta?.hidden) {
        return false
      } else {
        onlyOneChild.value = item
        return true
      }
    })

    if (showingChildren.length === 1) {
      return true
    }

    if (showingChildren.length === 0) {
      onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }

      return true
    }
    return false
  }

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
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren)
      "
    >
      <div
        v-if="onlyOneChild.meta && onlyOneChild.meta.group"
        class="b-t-1px c-#93959C py-15px px-8px b-solid b-#F5F5F5"
      >
        <span v-if="opened">{{ onlyOneChild.meta.group }}</span>
      </div>
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <svg-icon
            v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
            :icon-class="onlyOneChild.meta.icon"
            class="menu-icon"
          />
          <span
            v-if="
              opened &&
              onlyOneChild.meta &&
              onlyOneChild.meta.requireLogin &&
              !hasSigned
            "
            class="login-tag inline-block absolute right-8px bg-#64C78C b-#139475 b-1px b-solid rd-4px c-#fff px-3px py-2px text-12px fw-600 lh-15px"
          >
            Login
          </span>
          <template #title>
            {{ onlyOneChild.meta.title }}
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu
      v-else
      :index="resolvePath(item.path)"
      teleported
      :class="{
        'is-manual-active': currentPath === item.meta.activePath
      }"
    >
      <template #title>
        <app-link
          v-if="item.meta.canRoute"
          :to="resolvePath(item.path)"
          class="flex-1"
        >
          <svg-icon
            v-if="item.meta && item.meta.icon"
            :icon-class="item.meta.icon"
            class="menu-icon"
          />
          <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
        </app-link>
        <template v-else>
          <svg-icon
            v-if="item.meta && item.meta.icon"
            :icon-class="item.meta.icon"
            class="menu-icon"
          />
          <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
        </template>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
  :deep(.el-menu-item .el-menu-tooltip__trigger) {
    width: auto !important;
  }
</style>
