import { RouteRecordRaw } from 'vue-router'
export const DetailLayout = () => import('@/layout/DetailLayout.vue')

function checkParams(val, to) {
  if (!to.params?.[val]) {
    return '/'
  }
}
export const DetailRoutes: RouteRecordRaw[] = [
  {
    path: '/block',
    component: DetailLayout,
    redirect: { name: 'BlockInfo' },
    children: [
      {
        path: ':blockNumber?',
        component: () => import('@/views/block/index.vue'),
        name: 'BlockInfo',
        meta: {
          title: 'Block Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'blockNumber')]
      }
    ]
  },
  {
    path: '/bundler',
    component: DetailLayout,
    redirect: { name: 'BundlerInfo' },
    children: [
      {
        path: ':bundler?',
        component: () => import('@/views/bundler/index.vue'),
        name: 'BundlerInfo',
        meta: {
          title: 'Bundler Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'bundler')]
      }
    ]
  },
  {
    path: '/paymaster',
    component: DetailLayout,
    redirect: { name: 'PaymasterInfo' },
    children: [
      {
        path: ':paymaster?',
        component: () => import('@/views/paymaster/index.vue'),
        name: 'PaymasterInfo',
        meta: {
          title: 'Paymaster Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'paymaster')]
      }
    ]
  },
  {
    path: '/factory',
    component: DetailLayout,
    redirect: { name: 'FactoryInfo' },
    children: [
      {
        path: ':factory?',
        component: () => import('@/views/factory/index.vue'),
        name: 'FactoryInfo',
        meta: {
          title: 'Factory Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'factory')]
      }
    ]
  },
  {
    path: '/account',
    component: DetailLayout,
    redirect: { name: 'AccountInfo' },
    children: [
      {
        path: ':account?',
        component: () => import('@/views/account/index.vue'),
        name: 'AccountInfo',
        meta: {
          title: 'Account Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'account')]
      }
    ]
  },
  {
    path: '/userop',
    component: DetailLayout,
    redirect: { name: 'UseropInfo' },
    children: [
      {
        path: ':userop?',
        component: () => import('@/views/userop/index.vue'),
        name: 'UseropInfo',
        meta: {
          title: 'UserOp Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'userop')]
      }
    ]
  },
  {
    path: '/tx',
    component: DetailLayout,
    redirect: { name: 'TxInfo' },
    children: [
      {
        path: ':tx?',
        component: () => import('@/views/tx/index.vue'),
        name: 'TxInfo',
        meta: {
          title: 'Tx Info',
          hidden: true
        },
        beforeEnter: [checkParams.bind(this, 'tx')]
      }
    ]
  }
]
