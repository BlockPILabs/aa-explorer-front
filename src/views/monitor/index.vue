<script setup lang="ts">
  import { useWeb3Modal } from '@web3modal/wagmi/vue'
  import { storeToRefs } from 'pinia'
  import { useWalletStore } from '@/store/modules/wallet'
  import {
    useAccountEffect,
    useSignMessage,
    useDisconnect,
    useAccount
  } from '@wagmi/vue'
  import { ElMessage } from 'element-plus'
  import WalletInfo from './components/WalletInfo/index.vue'
  import TrackerList from './components/TrackerList.vue'
  import { v4 as uuidv4 } from 'uuid'

  defineOptions({
    name: 'Monitor'
  })
  const { disconnect } = useDisconnect()

  const modal = useWeb3Modal()
  const walletStore = useWalletStore()
  const { hasSigned } = storeToRefs(walletStore)
  const { walletLogin, walletSign } = walletStore
  const tempData: any = ref({})
  const { signMessageAsync } = useSignMessage()

  const signing = ref(false)

  async function signMsg() {
    try {
      signing.value = true
      const signWords = `Welcome to AA Explorer powered by BlockPI!\n\nClick "Sign" to sign in with ${
        tempData.value
      }\n\nThis requests will only verify that you are the owner of this address and will not trigger any transactions.\nFor your safety, the nonce and timestamp are used to determine the uniqueness of this signature.\n\nNonce: ${uuidv4()}\nTimestamp: ${new Date().getTime()}`
      const res = await signMessageAsync({ message: signWords })
      walletLogin(tempData.value || '')
      walletSign({ signature: res || '', message: signWords })
    } catch (error: any) {
      disconnect()
      ElMessage.error(error.shortMessage || error.message || 'Something Error')
    } finally {
      signing.value = false
    }
  }
  useAccountEffect({
    onConnect(data) {
      if (!hasSigned.value) {
        tempData.value = data.address
        signMsg()
      }
    }
  })
  function handleConnect() {
    modal.open()
  }
  const { address } = useAccount()
  onMounted(() => {
    if (address.value && !hasSigned.value) {
      tempData.value = address.value
      signMsg()
    }
  })
</script>

<template>
  <div
    v-if="!hasSigned"
    class="absolute top-0 left-50% translate-x--50% flex flex-col items-center justify-center h-full"
  >
    <svg-icon
      iconClass="monitor-bg"
      class="w-253px! h136px! mb-32px"
    ></svg-icon>
    <el-button @click="handleConnect" class="connect-btn" :loading="signing">
      Connect Wallet
    </el-button>
    <span class="text-18px mt-24px c-#60626a">
      Connect wallet to monitor AA address/paymaster/bundler
    </span>
  </div>

  <el-row v-else :gutter="16">
    <el-col :md="8">
      <WalletInfo />
    </el-col>
    <el-col :md="16"> <TrackerList /></el-col>
  </el-row>
</template>

<style lang="scss" scoped>
  .connect-btn {
    background: #c5e86c;
    height: 46px;
    font-weight: 600;
    font-size: 18px;
    color: #303030;
  }
</style>
