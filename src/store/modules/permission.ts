import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { store } from '@/store'

// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes = ref<RouteRecordRaw[]>(constantRoutes)

  return { routes }
})

// not setup
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
