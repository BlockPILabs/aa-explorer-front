<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { useRouter } from 'vue-router'
  const chainStore = useChainStore()
  const { supportChains, choosingChain } = storeToRefs(chainStore)
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:visible'])
  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => {
      emits('update:visible', val)
    }
  })
  const filterVal = ref('')
  const filterList = computed(() => {
    if (filterVal.value) {
      return supportChains.value.filter((item) => {
        return (
          item.chainName
            .toLowerCase()
            .includes(filterVal.value.toLowerCase()) ||
          item.name.toLowerCase().includes(filterVal.value.toLowerCase()) ||
          item.network.toLowerCase().includes(filterVal.value.toLowerCase())
        )
      })
    } else {
      return supportChains.value
    }
  })
  const availChainAmount = filterList.value.length || 0
  const router = useRouter()
  function handleChoose(item) {
    if (item.network === choosingChain.value) {
      dialogVisible.value = false
    } else {
      chainStore.updateChooseChain(item)
      dialogVisible.value = false
      router.go(0)
    }
  }
</script>

<template>
  <el-dialog v-model="dialogVisible" append-to-body class="choose-chain-dialog">
    <template #header>
      <div class="my-header text-18px fw-700">
        <span>Choose Chain</span>
      </div>
    </template>
    <el-input
      placeholder="Search by Chain"
      class="filter-input"
      v-model="filterVal"
      clearable
    >
      <template #prefix>
        <svg-icon iconClass="search" class="w-20px! h-20px!" />
      </template>
    </el-input>
    <div class="mt-32px mb-16px text-16px">
      <strong>Chains </strong>
      <span class="c-#93959c">{{ availChainAmount }}</span>
    </div>
    <el-scrollbar height="450px">
      <div class="grid gap-x-16px grid-cols-3 chain-list">
        <template v-for="(item, index) in filterList" :key="item.network">
          <div
            class="chain-item p-x-16px p-y-8px rd-8px b-1px b-solid b-#fff flex items-center cursor-pointer hover:bg-#F4F6EF hover:b-#30754B"
            @click="handleChoose(item)"
          >
            <div
              class="network-box flex-shrink-0 w-48px h-48px mr-8px flex items-center justify-center"
            >
              <svg-icon
                :iconClass="item.chainIcon"
                class="w-32px! h-32px!"
              ></svg-icon>
            </div>
            <div>
              <strong class="text-16px mb-2px">{{ item.chainName }}</strong
              ><br />
              <span class="c-#93959c">{{ item.name }}</span>
            </div>
          </div>
          <div
            v-if="(index + 1) % 3 === 0 && index + 1 !== filterList.length"
            class="divide h-1px m-y-8px bg-#edecec"
          ></div>
        </template>
      </div>
    </el-scrollbar>
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
  .divide {
    grid-column: 1 / 4;
  }
  .network-box {
    background: url('../../../assets/icons/hexgon.svg') no-repeat center center;
    background-size: 100% auto;
  }
  @media screen and (max-width: 992px) {
    .chain-list {
      grid-template-columns: 1fr 1fr;
      .chain-item {
        padding: 4px 4px;
      }
      .divide {
        display: none;
      }
    }
  }
</style>
<style lang="scss">
  .choose-chain-dialog {
    max-width: 844px;
    width: calc(100% - 20px);
    .el-dialog__headerbtn {
      top: 0px;
    }
  }
  @media screen and (max-width: 768px) {
    .choose-chain-dialog {
      .el-scrollbar {
        .el-scrollbar__wrap {
          height: 300px !important;
        }
      }
    }
  }
</style>
