<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useWalletStore } from '@/store/modules/wallet'
  import { formatHash } from '@/utils/formatHash'
  const walletStore = useWalletStore()
  const { wallet } = storeToRefs(walletStore)
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    connectorName: {
      type: String,
      default: ''
    },
    connectorPic: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits(['update:visible'])
  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => {
      emits('update:visible', val)
    }
  })

  function handleQuit() {
    dialogVisible.value = false
    walletStore.walletLogout()
  }
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    class="logout-dialog"
  >
    <template #header>
      <div class="my-header text-18px fw-700">
        <span>Your Wallet</span>
      </div>
    </template>
    <div class="c-#303030 text-16px mb-16px">
      <span>Connected with {{ connectorName }}</span>
    </div>

    <div class="flex justify-between items-center">
      <div class="flex items-center gap-8px">
        <img :src="connectorPic" v-if="connectorPic" class="w-18px h-18px" />
        <span class="c-#5F8401 text-18px">{{ formatHash(wallet) }}</span>
      </div>
      <router-link
        class="inline-flex items-center justify-start px-8px py-6px rd-4px b-1px b-solid b-#dbdcdd cursor-pointer fw-600 c-#60626A hover:bg-#222 hover:c-#fff"
        :to="{
          name: 'AccountInfo',
          params: { account: wallet }
        }"
      >
        <span>View on AA Explorer</span>
        <svg-icon
          iconClass="next_page"
          class="w-16px! h-16px! ml-4px"
        ></svg-icon>
      </router-link>
    </div>
    <div class="w-100% h-1px bg-#EDECEC my-16px"></div>
    <div>
      <el-button type="primary" @click="handleQuit">Logout</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
<style lang="scss">
  .logout-dialog {
    max-width: 580px;
    width: calc(100% - 20px);
    .el-dialog__headerbtn {
      top: 0px;
    }
  }
</style>
