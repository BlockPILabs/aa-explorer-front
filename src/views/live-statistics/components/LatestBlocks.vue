<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useChainStore } from '@/store/modules/chain'
  import { getBlockList } from '@/api/modules/stat'
  import { last } from 'lodash-es'
  const chainStore = useChainStore()
  const { choosingChain, choosingCoinLogo } = storeToRefs(chainStore)
  const router = useRouter()
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
    router.push({ name: 'BlockList' })
  }

  const dataSource = ref<any>([])
  const latestBlock = computed(() => {
    if (queue.value.length > 0) {
      return last(queue.value).number
    } else {
      return dataSource.value[0]?.number || 0
    }
  })
  const loading = ref(false)
  function pollingData() {
    getList(false)
  }
  async function getList(init = true) {
    try {
      init && (loading.value = true)
      const res = await getBlockList(choosingChain.value, {
        perPage: init ? 10 : 999,
        page: 1,
        latestBlockNumber: latestBlock.value
      })
      if (init) {
        dataSource.value = res?.records || []
        resume()
      } else {
        const arr = (res?.records || []).reverse()
        queue.value.push(...arr)
        insertData()
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  const { resume } = useTimeoutPoll(pollingData, 1000 * 5)
  onMounted(() => {
    getList()
  })
</script>

<template>
  <my-card class="h-430px" noPad>
    <template #title>
      <span class="fw-700 text-18px">Latest AA Blocks</span>
    </template>
    <template #right>
      <div
        class="px-8px py-6px cursor-pointer bg-#f8f8f8 c-#60626a rd-4px hover:bg-#222 hover:c-#fff"
        @click="goMore"
      >
        <span class="fw-600">More</span>
        <svg-icon iconClass="turn" class="w-16px! h-16px!"></svg-icon>
      </div>
    </template>
    <el-scrollbar max-height="345px" v-loading="loading">
      <TransitionTable :dataSource="dataSource" v-if="dataSource.length > 0">
        <template #title>
          <th class="block-it min-w-110px">
            <span>#</span>
          </th>
          <th class="userop-it min-w-100px">
            <span>UserOps</span>
          </th>
          <!-- <th class="mev-it min-w-144px">
              <span>MEV</span>
            </th> -->
          <th class="profit-it min-w-120px text-right!">
            <span>Bundler Profits</span>
          </th>
        </template>
        <template
          #default="{ number, useropCount, bundlerProfit, bundlerProfitUsd }"
        >
          <td class="block-it c-#30754B">
            <RouterLink
              :to="{ name: 'BlockInfo', params: { blockNumber: number } }"
              >{{ number }}</RouterLink
            >
          </td>
          <td class="userop-it">
            <number-show :number="useropCount" />
          </td>
          <!-- <div class="mev-it min-w-144px">
              <span>{{ mev }}</span>
            </div> -->
          <td class="profit-it text-right">
            <div>
              <div class="mb-4px">
                <svg-icon
                  :iconClass="choosingCoinLogo"
                  class="w-16px! h-16px! mr-4px"
                ></svg-icon>
                <number-show
                  :number="bundlerProfit"
                  class="fw-600"
                  format="0,0.[000000]"
                />
              </div>
              <div>
                <number-show
                  :number="bundlerProfitUsd"
                  format="{&asymp;$}0,0.[000]"
                  class="c-#93959C"
                />
              </div>
            </div>
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
  </my-card>
</template>

<style lang="scss" scoped>
  .table-item {
    flex: 1;
    word-wrap: break-word;
  }
</style>
