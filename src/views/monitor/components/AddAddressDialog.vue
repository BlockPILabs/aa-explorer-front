<script setup lang="ts">
  import { debounce } from 'lodash-es'
  import { isAddress } from 'viem'
  import { addMonitor, checkAddressType } from '@/api/modules/monitor'

  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { SIGN_MSG_KEY } from '@/utils/cookie-keys'

  const cookies = useCookies()
  const signInfo = cookies.get(SIGN_MSG_KEY)
  const chainStore = useChainStore()
  const { choosingChain, supportChains } = storeToRefs(chainStore)
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:visible', 'refresh-list'])
  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => {
      emits('update:visible', val)
    }
  })
  const filterVal = ref('')
  const addressType = ref('')
  const notFound = ref(false)

  const isInvalid = computed(() => {
    return !isAddress(filterVal.value)
  })
  const checking = ref(false)
  async function checkAddress() {
    if (!isInvalid.value) {
      // seach for type

      try {
        checking.value = true

        const res = await checkAddressType(choosingChain.value, {
          accountAddress: filterVal.value
        })
        addressType.value = res.type || ''
        notFound.value = false
      } catch (error) {
        addressType.value = ''
        notFound.value = true
      } finally {
        checking.value = false
      }
    }
  }

  const debounceInput = debounce(checkAddress, 500)

  async function handleSubmit() {
    try {
      const res = await addMonitor(choosingChain.value, {
        monitorAddress: filterVal.value,
        sign: signInfo.signature,
        message: signInfo.message
      })
      filterVal.value = ''
      emits('refresh-list')
    } catch (error) {}
  }

  function handleCancel() {
    filterVal.value = ''
    dialogVisible.value = false
  }
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    class="add-address-dialog"
  >
    <template #header>
      <div class="my-header text-18px fw-700">
        <span>Add Address</span>
      </div>
    </template>
    <div class="c-#303030 fw-600 text-16px mb-8px">
      <span>Address</span>
    </div>
    <el-input
      placeholder="0x"
      class="filter-input"
      v-model="filterVal"
      clearable
      @input="debounceInput"
    >
    </el-input>
    <div class="mt-8px mb-16px">
      <span class="c-#93959c" v-show="addressType">{{ addressType }}</span>
      <span class="c-#C16666" v-show="notFound"> Address not found. </span>
    </div>
    <div class="w-100% h-1px bg-#EDECEC my-16px"></div>
    <el-scrollbar
      v-show="!checking && addressType && !isInvalid && !notFound"
      max-height="400px"
    >
      <div class="grid gap-8px grid-cols-2 chain-list">
        <template v-for="(item, index) in supportChains" :key="item.network">
          <div
            class="chain-item p-x-16px p-y-8px rd-8px b-1px b-solid flex items-center bg-#F4F6EF b-#F4F6EF"
          >
            <div
              class="network-box flex-shrink-0 w-48px h-48px mr-8px flex items-center justify-center"
            >
              <svg-icon
                :iconClass="item.chainIcon"
                class="w-32px! h-32px!"
              ></svg-icon>
            </div>
            <div class="break-all">
              <strong class="text-16px mb-2px">{{ item.chainName }}</strong
              ><br />
              <span class="c-#93959c">{{ item.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </el-scrollbar>
    <div class="mt-16px" v-show="!notFound">
      <el-button
        type="primary"
        :disabled="isInvalid && checking"
        @click="handleSubmit"
        >Submit</el-button
      >
      <el-button class="bg-none! b-none!" plain @click="handleCancel">
        Cancel
      </el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .filter-input {
    :deep() {
      .el-input__wrapper {
        background-color: #f9f9f9;
      }
    }
  }
</style>
<style lang="scss">
  .add-address-dialog {
    max-width: 580px;
    width: calc(100% - 20px);
    .el-dialog__headerbtn {
      top: 0px;
    }
    .network-box {
      background: url('../../../assets/icons/hexgon.svg') no-repeat center
        center;
      background-size: 100% auto;
    }
    @media screen and (max-width: 768px) {
      .chain-item {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
</style>
