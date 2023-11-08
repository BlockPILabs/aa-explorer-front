import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { DetailRoutes } from './detailRoute'
export const Layout = () => import('@/layout/index.vue')

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    component: Layout,
    redirect: '/live-statistics',
    children: [
      {
        path: 'live-statistics',
        component: () => import('@/views/live-statistics/index.vue'),
        name: 'LiveStatistics',
        meta: {
          title: 'Live Statistics',
          icon: 'stats'
        }
      },
      {
        path: '404',
        name: 'NotFound',
        component: () => import('@/views/error-page/404.vue'),
        meta: { hidden: true }
      }
    ]
  },
  {
    path: '/characters',
    component: Layout,
    meta: {
      title: 'Character List',
      icon: 'character',
      canRoute: true,
      activePath: '/characters'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/characters/index.vue'),
        name: 'CharacterList',
        meta: {
          title: 'Character List',
          icon: 'character',
          hidden: true
        }
      },
      {
        path: 'bundler',
        component: () => import('@/views/characters/bundler/index.vue'),
        name: 'BundlerList',
        meta: {
          title: 'Bundler List'
        }
      },
      {
        path: 'paymaster',
        component: () => import('@/views/characters/paymaster/index.vue'),
        name: 'PaymasterList',
        meta: {
          title: 'Paymaster List'
        }
      },
      {
        path: 'factory',
        component: () => import('@/views/characters/factory/index.vue'),
        name: 'FactoryList',
        meta: {
          title: 'Factory List'
        }
      }
    ]
  },
  {
    path: '/blocks',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/blocks/index.vue'),
        name: 'BlockList',
        meta: {
          title: 'Block List',
          icon: 'block'
        }
      }
    ]
  },

  {
    path: '/userops',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/userops/index.vue'),
        name: 'UserOpList',
        meta: {
          title: 'UserOp List',
          icon: 'transaction'
        }
      }
    ]
  },
  {
    path: '/userop-analyze',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/userop-analyze/index.vue'),
        name: 'UseropAnalyze',
        meta: {
          title: 'UserOp Analyze',
          icon: 'line_chart',
          group: 'Tools'
        }
      }
    ]
  },
  {
    path: '/aa-mev-monitor',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/aa-mev-monitor/index.vue'),
        name: 'AAMevMonitor',
        meta: {
          title: 'AA MEV Monitor',
          icon: 'outline_sandwich'
        }
      }
    ]
  },
  {
    path: '/aa-whale',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/aa-whale/index.vue'),
        name: 'AAWhale',
        meta: {
          title: 'AA Whale',
          icon: 'whale'
        }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/monitor/index.vue'),
        name: 'Monitor',
        meta: {
          title: 'Monitor',
          icon: 'aim'
        }
      }
    ]
  },
  ...DetailRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

/**
 * create router
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH),
  routes: constantRoutes as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * reset router
 */
export function resetRouter() {
  router.replace({ path: '/' })
}

export default router
