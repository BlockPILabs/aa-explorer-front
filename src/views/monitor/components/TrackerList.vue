<script setup lang="tsx">
  import 'element-plus/es/components/message-box/style/css'

  import AddAddressDialog from './AddAddressDialog.vue'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { useTitanTableScrollHeight } from '@/hooks/useTitanTableScrollHeight'
  import { getTrackers, removeMonitor } from '@/api/modules/monitor'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { useWalletStore } from '@/store/modules/wallet'
  import { useCookies } from '@vueuse/integrations/useCookies'
  import { SIGN_MSG_KEY } from '@/utils/cookie-keys'
  import { ElMessageBox } from 'element-plus'
  const cookies = useCookies()
  const signInfo = cookies.get(SIGN_MSG_KEY)
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const walletStore = useWalletStore()
  const { wallet } = storeToRefs(walletStore)
  const page = ref(1)
  const perPage = ref(20)
  const loading = ref(false)
  const list = ref<any>([])
  const total = ref(0)
  const noMore = computed(() => {
    return (!total.value || list.value.length >= total.value) && !loading.value
  })
  const disabled = computed(() => loading.value || noMore.value)
  const showAdd = ref(false)
  function handleClick() {
    showAdd.value = true
  }
  function handleRefresh() {
    showAdd.value = false
    page.value = 1
    getList()
  }
  function openDel(row) {
    ElMessageBox.confirm('Are you sure to delete?', 'Tips', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async () => {
        try {
          await removeMonitor(choosingChain.value, {
            monitorAddress: row.monitorAddress,
            sign: signInfo.signature,
            message: signInfo.message
          })
          handleRefresh()
        } catch (error) {
          console.error(error)
        }
      })
      .catch(() => {})
  }
  const tableCol = ref<any>([
    {
      minWidth: 140,
      render: ({ row }) => {
        return (
          <div class='flex flex-col gap-8px items-start'>
            <span class='c-#303030 fw-600'>{row.addressType}</span>
            <CopyMe class='c-#30754B' hash={row.monitorAddress}></CopyMe>
          </div>
        )
      }
    },
    {
      minWidth: 200,
      render: ({ row }) => {
        const label =
          row.addressType === 'Bundler'
            ? 'Profits'
            : row.addressType === 'Paymaster'
            ? 'Gas Sponsored'
            : ''
        const amount =
          row.addressType === 'Bundler'
            ? row.profits24H
            : row.addressType === 'Paymaster'
            ? row.sponsoredGas24H
            : 0
        if (row.addressType === 'Bundler' && row.addressType === 'Paymaster') {
          return <span></span>
        } else {
          return (
            <div class='flex flex-col gap-8px items-start fw-600'>
              <span class='c-#93959C'>24H {label}</span>
              <div>
                <number-show
                  number={amount}
                  format='$0,0.[000]'
                  class='c-#303030 mr-4px'
                ></number-show>
                <number-show
                  number={row.totalUserOps}
                  format='0,0'
                  prefix={row.addressType === 'Bundler' ? 'From ' : 'To '}
                  suffix={row.totalUserOps > 1 ? ' UserOps' : ' UserOp'}
                  class='c-#30754B'
                ></number-show>
              </div>
            </div>
          )
        }
      }
    },
    {
      align: 'right',
      minWidth: 100,
      render: ({ row }) => {
        const warnTip =
          row.addressType === 'Paymaster' && row.balance < 10 ? (
            <el-tooltip content='Low Balance' placement='top'>
              <svg-icon
                iconClass='exclamation'
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
            </el-tooltip>
          ) : (
            ''
          )
        return (
          <div class='flex flex-col gap-8px fw-600'>
            <span class='c-#93959C'>
              {warnTip}
              Balance
            </span>
            <number-show
              number={row.balance}
              format='$0,0.[000]'
              class='c-#303030'
            ></number-show>
          </div>
        )
      }
    },
    {
      width: 50,
      align: 'right',
      render: ({ row }) => {
        return (
          <div class='operations hover-show'>
            <svg-icon
              iconClass='delete'
              class='w-16px! h-16px! cursor-pointer'
              onClick={() => openDel(row)}
            ></svg-icon>
          </div>
        )
      }
    }
  ])
  function load() {
    if (disabled.value) return
    page.value++
    getList()
  }
  async function getList() {
    try {
      loading.value = true
      const res = await getTrackers(choosingChain.value, {
        perPage: perPage.value,
        page: page.value,
        userAddress: wallet.value
      })
      total.value = res?.totalCount
      if (page.value === 1) {
        list.value = res?.monitors || []
      } else {
        const newList = res?.monitors || []
        list.value = list.value.concat(...newList)
      }
    } catch (error) {
      console.error(error)
      if (page.value > 1) {
        page.value--
      }
    } finally {
      loading.value = false
    }
  }
  const { table, tableHeight } = useTitanTableScrollHeight()

  onMounted(() => {
    page.value = 1
    getList()
  })
</script>

<template>
  <my-card noPad>
    <template #title>
      <span class="fw-700 text-18px">AA Tracker</span>
    </template>
    <template #right>
      <el-button type="primary" @click="handleClick">
        <svg-icon iconClass="plus" class="w-16px! h-16px! mr-4px"></svg-icon>
        <span class="fw-600">Add Address</span>
      </el-button>
    </template>
    <div class="px-16px" v-loading="loading">
      <titan-table
        ref="table"
        :data="list"
        :columns="tableCol"
        class="tracker-table"
        :options="{ showHeader: false }"
        height="100%"
        :max-height="tableHeight"
        v-el-table-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
      >
        <template #append>
          <p v-if="noMore && list.length > 0" class="text-center pt-32px">
            No more
          </p>
          <p v-if="loading" class="text-center pt-4px">Loading...</p>
        </template>
        <template #empty>
          <div
            class="empty absolute top-120px left-50% translate-x--50% text-center c-#60626A"
          >
            <el-button type="primary" @click="handleClick">
              <svg-icon
                iconClass="plus"
                class="w-16px! h-16px! mr-4px"
              ></svg-icon>
              <span class="fw-600">Add Address</span>
            </el-button>
            <p class="mt-16px">
              Add addresses to monitor AA wallets/paymasters/bundlers
            </p>
          </div>
        </template>
      </titan-table>
    </div>
    <AddAddressDialog
      v-model:visible="showAdd"
      @refresh-list="handleRefresh"
    ></AddAddressDialog>
  </my-card>
</template>

<style lang="scss" scoped>
  .tracker-table.titan-table {
    :deep() {
      .el-table__body {
        border-spacing: 0px 10px;
        tr {
          background: none;
          &:hover {
            td.el-table__cell {
              border-color: #30754b;
            }
          }
        }
        td.el-table__cell {
          background: #f4f6ef;
          border-top: 1px solid #f4f6ef;
          border-bottom: 1px solid #f4f6ef;
          &:first-of-type {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            border-left: 1px solid #f4f6ef;
          }
          &:last-of-type {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            border-right: 1px solid #f4f6ef;
          }
        }
      }
      .hover-show {
        visibility: hidden;
      }

      .el-table__row:hover .hover-show {
        visibility: visible;
      }
    }
  }
</style>
