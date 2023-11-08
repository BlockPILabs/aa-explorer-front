<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  import { useChainStore } from '@/store/modules/chain'
  import { useRouter } from 'vue-router'
  import TimeAgo from '@/components/TimeAgo/index.vue'
  import TransitionList from '@/components/TransitionList/index.vue'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { StatusMap } from '@/enums'
  import { getUserOps, getLatestUserOps } from '@/api/modules/stat'
  import { last } from 'lodash-es'
  import TargetsWrapper from '@/components/TargetsWrapper/index.vue'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const router = useRouter()
  // const listTypes = ref([
  //   { label: 'Completed', value: 'completed', icon: 'home-completed' }
  //   { label: 'Pending', value: 'pending', icon: 'home-pending' }
  // ])
  // const currType = ref('completed')

  // function handChoose(val) {
  //   currType.value = val
  // }
  let activeTimeout = false
  const timeoutId = ref<any>(null)
  const { start, stop } = useTimeoutFn(() => {
    handleInsert()
  }, 800)
  const maxCount = 10
  const queue = ref<any>([])
  function insertData() {
    if (!activeTimeout) {
      activeTimeout = true
      handleInsert()
      timeoutId.value = start()
    }
  }
  function handleInsert() {
    if (queue.value.length > 0) {
      const obj = queue.value.shift()
      dataSource.value.unshift(obj)
      if (dataSource.value.length > maxCount) {
        dataSource.value.pop()
      }
      start()
    } else {
      activeTimeout = false
      stop()
    }
  }
  function goMore() {
    router.push({ name: 'UserOpList' })
  }

  const dataSource = ref<any>([])
  const latestBlock = computed(() => {
    if (queue.value.length > 0) {
      return last(queue.value).blockNumber
    } else {
      return dataSource.value[0]?.blockNumber || 0
    }
  })
  const loading = ref(false)
  function pollingData() {
    getList(false)
  }
  async function getList(init = true) {
    try {
      init && (loading.value = true)
      const res = await getUserOps(choosingChain.value, {
        perPage: init ? 10 : 999,
        page: 1,
        latestBlockNumber: latestBlock.value,
        // hack for slow request
        totalCount: 100,
        startTime: new Date().getTime() - 24 * 3600 * 1000
      })
      if (init) {
        dataSource.value = (res.records || []).map((item) => {
          item.visible = false
          return item
        })
        resume()
      } else {
        const arr = (res.records || [])
          .map((item) => {
            item.visible = false
            return item
          })
          .reverse()
        queue.value.push(...arr)
        insertData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  function toggleShow(item) {
    const obj = dataSource.value.find(
      (o) => o.userOperationHash === item.userOperationHash
    )
    obj.visible = !obj.visible
  }
  function hidePopover(item) {
    const obj = dataSource.value.find(
      (o) => o.userOperationHash === item.userOperationHash
    )
    obj.visible = false
  }
  const { resume } = useTimeoutPoll(pollingData, 1000 * 5)
  const statInfo = reactive({
    averageProcessTime24h: 0,
    averageGasCost24h: 0,
    pendingTransactionNum: 0
  })
  const statloading = ref(false)
  async function getStat() {
    try {
      statloading.value = true
      const res = await getLatestUserOps(choosingChain.value)
      const {
        averageProcessTime24h,
        averageGasCost24h,
        pendingTransactionNum
      } = res
      statInfo.averageProcessTime24h = averageProcessTime24h
      statInfo.averageGasCost24h = averageGasCost24h
      statInfo.pendingTransactionNum = pendingTransactionNum
    } catch (error) {
      console.error(error)
      statInfo.averageProcessTime24h = 0
      statInfo.averageGasCost24h = 0
      statInfo.pendingTransactionNum = 0
    } finally {
      statloading.value = false
    }
  }
  onMounted(() => {
    getList()
    getStat()
  })
</script>

<template>
  <my-card class="mt-16px">
    <template #title>
      <span class="fw-700 text-18px">UserOps</span>
    </template>
    <template #right>
      <div class="flex items-center">
        <!-- <div
          class="flex items-center px-4px py-4px rd-4px bg-#f8f8f8 c-#93959C"
        >
          <div
            v-for="item in listTypes"
            :key="item.value"
            class="flex items-center type-tag px-8px py-6px rd-4px cursor-pointer mr-4px last:mr-0px"
            :class="{ 'active-type': currType === item.value }"
            @click="handChoose(item.value)"
          >
            <svg-icon
              :iconClass="item.icon"
              class="mr-4px w-16px! h-16px!"
            ></svg-icon>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <div class="w-1px h-29px bg-#edecec mx-16px"></div> -->
        <div
          class="px-8px py-6px cursor-pointer bg-#f8f8f8 c-#60626a rd-4px hover:bg-#222 hover:c-#fff"
          @click="goMore"
        >
          <span class="fw-600">More</span>
          <svg-icon iconClass="turn" class="w-16px! h-16px!"></svg-icon>
        </div>
      </div>
    </template>
    <div class="grid gap-16px userops-main">
      <div class="info-list" v-loading="statloading">
        <div
          class="info-item flex items-center justify-between px-16px py-10px rd-8px b-1px b-solid b-#edecec"
        >
          <div class="flex flex-col">
            <number-show
              :number="statInfo.averageProcessTime24h"
              format="0,0{s}"
              class="text-32px mb-4px fw-600"
            ></number-show>
            <span class="c-#93959C">Average Processing Time(1H)</span>
          </div>
          <svg-icon
            iconClass="home-time"
            class="w-16px! h-16px! c-#DBDCDD"
          ></svg-icon>
        </div>
        <div
          class="info-item flex items-center justify-between px-16px py-10px rd-8px b-1px b-solid b-#edecec my-16px"
        >
          <div class="flex flex-col">
            <number-show
              :number="statInfo.averageGasCost24h"
              format="0,0.[000000]"
              class="text-32px mb-4px fw-600"
            ></number-show>
            <span class="c-#93959C">Average Gas Consumed(24H)</span>
          </div>
          <svg-icon
            iconClass="home-gas"
            class="w-16px! h-16px! c-#DBDCDD"
          ></svg-icon>
        </div>
        <div
          class="info-item flex items-center justify-between px-16px py-10px rd-8px b-1px b-solid b-#edecec"
        >
          <div class="flex flex-col">
            <number-show
              :number="statInfo.pendingTransactionNum"
              format="0,0"
              class="text-32px mb-4px fw-600"
            ></number-show>
            <span class="c-#93959C">Pending Transaction</span>
          </div>
          <svg-icon
            iconClass="home-pending_transaction"
            class="w-16px! h-16px! c-#DBDCDD"
          ></svg-icon>
        </div>
      </div>
      <el-scrollbar height="270px" v-loading="loading">
        <TransitionTable
          v-if="dataSource.length > 0"
          :dataSource="dataSource"
          uniqueKey="userOperationHash,txHash"
        >
          <template #title>
            <th class="userop-it min-w-160px">
              <span>UserOp Hash</span>
            </th>
            <th class="time-it min-w-88px">
              <span>Time</span>
            </th>
            <th class="sender-it min-w-138px">
              <span>Sender</span>
            </th>
            <th class="to-it min-w-44px w-44px"></th>
            <th class="target-it min-w-200px">
              <span>Target</span>
            </th>
            <th class="source-it min-w-120px">
              <span>Source</span>
            </th>
            <th class="status-it min-w-104px">
              <span>Status</span>
            </th>
          </template>
          <template #default="listItem">
            <td class="userop-it c-#30754B">
              <CopyMe
                :hash="listItem.userOperationHash"
                :routeInfo="{
                  name: 'UseropInfo',
                  params: { userop: listItem.userOperationHash },
                  query: { tx: listItem.txHash }
                }"
              />
            </td>
            <td class="time-it">
              <TimeAgo :time="listItem.time" suffix=" ago" />
            </td>
            <td class="sender-it c-#30754B">
              <CopyMe
                :hash="listItem.sender"
                :routeInfo="{
                  name: 'AccountInfo',
                  params: { account: listItem.sender }
                }"
              />
            </td>
            <td class="to-it">
              <svg-icon iconClass="home-to" class="w-20px! h-20px!"></svg-icon>
            </td>
            <td class="target-it c-#30754B">
              <TargetsWrapper
                :info="listItem"
                :autoClose="2000"
                @hidePopover="hidePopover"
                @toggleShow="toggleShow"
              />
            </td>
            <td class="source-it">
              <el-tooltip
                :content="listItem.source"
                placement="top"
                :disabled="!listItem.source"
              >
                <span
                  class="text-truncate inline-block px-8px py-2px c-#60626A rd-4px w-96px h-21px bg-#CBDAFA text-center"
                  >{{ listItem.source }}</span
                >
              </el-tooltip>
            </td>
            <td class="status-it">
              <svg-icon
                :iconClass="StatusMap[listItem.status]?.icon"
                class="w-16px! h-16px! mr-4px"
              ></svg-icon>
              <span>{{ StatusMap[listItem.status]?.label }}</span>
            </td>
          </template>
        </TransitionTable>
        <div
          class="empty text-center c-#60626A py-16px"
          v-if="dataSource.length === 0"
        >
          <span>No data</span>
        </div>
      </el-scrollbar>
    </div>
  </my-card>
</template>

<style lang="scss" scoped>
  .type-tag {
    &:hover,
    &.active-type {
      color: #fff;
      background: #222;
    }
  }
  .userops-main {
    grid-template-columns: 273px auto;
  }
  @media screen and (max-width: 992px) {
    .userops-main {
      grid-template-columns: 1fr;
    }
  }
</style>
