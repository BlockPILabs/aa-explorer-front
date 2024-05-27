import { defineStore } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import { SIGN_MSG_KEY, SIGN_WALLET_KEY } from '@/utils/cookie-keys'
import { useDisconnect } from '@wagmi/vue'
export const useWalletStore = defineStore('wallet', () => {
  const cookies = useCookies()
  const wallet = ref(cookies.get(SIGN_WALLET_KEY) || '')

  function walletLogin(address: string) {
    wallet.value = address
    cookies.set(SIGN_WALLET_KEY, address, { maxAge: 24 * 60 * 60 })
  }

  function walletSign(info: { signature: string; message: string }) {
    cookies.set(SIGN_MSG_KEY, info, { maxAge: 24 * 60 * 60 })
  }

  const { disconnect } = useDisconnect()

  function walletLogout() {
    wallet.value = ''
    cookies.remove(SIGN_WALLET_KEY)
    cookies.remove(SIGN_MSG_KEY)
    disconnect()
  }

  const hasSigned = computed(() => {
    return wallet.value.length > 0
  })
  return {
    wallet,
    walletLogin,
    walletSign,
    walletLogout,
    hasSigned
  }
})
