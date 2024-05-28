<script setup lang="ts">
  import { ElConfigProvider } from 'element-plus'
  import { useAppStore } from '@/store/modules/app'

  import { useWalletStore } from '@/store/modules/wallet'
  import { useAccountEffect, useDisconnect } from '@wagmi/vue'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { SIGN_MSG_KEY, SIGN_WALLET_KEY } from '@/utils/cookie-keys'
  const { disconnect } = useDisconnect()
  const { addChangeListener } = useCookies([SIGN_MSG_KEY, SIGN_WALLET_KEY])
  addChangeListener((data) => {
    if (data.value === undefined || data.value === null) {
      // remove cookie
      disconnect()
    }
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
