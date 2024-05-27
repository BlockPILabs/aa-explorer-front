<script setup lang="ts">
  import { ElConfigProvider } from 'element-plus'
  import { useAppStore } from '@/store/modules/app'
  import { createWeb3Modal } from '@web3modal/wagmi/vue'

  import { config, projectId } from '@/config'
  import { useWalletStore } from '@/store/modules/wallet'
  import { useAccountEffect, useDisconnect } from '@wagmi/vue'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { SIGN_MSG_KEY, SIGN_WALLET_KEY } from '@/utils/cookie-keys'
  const { disconnect } = useDisconnect()
  const { addChangeListener } = useCookies([SIGN_MSG_KEY, SIGN_WALLET_KEY])
  addChangeListener((data) => {
    console.log(data)
    if (data.value === undefined || data.value === null) {
      // remove cookie
      disconnect()
    }
  })
  // 3. Create modal
  createWeb3Modal({
    themeMode: 'light',
    themeVariables: {
      '--w3m-font-family': 'Barlow',
      '--w3m-z-index': 9999999
    },
    // @ts-ignore
    wagmiConfig: config,
    projectId
  })
  const appStore = useAppStore()
  const walletStore = useWalletStore()
  useAccountEffect({
    onDisconnect() {
      walletStore.walletLogout()
    }
  })
</script>

<template>
  <el-config-provider :size="appStore.size">
    <router-view />
  </el-config-provider>
</template>
