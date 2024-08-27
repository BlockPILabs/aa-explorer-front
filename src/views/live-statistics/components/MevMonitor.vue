<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  import { useRouter } from 'vue-router'
  import TimeAgo from '@/components/TimeAgo/index.vue'
  import CopyMe from '@/components/CopyMe/index.vue'
  import { MEVTypeMap } from '@/enums'
  import { getMevTransaction } from '@/api/modules/stat'
  import { last, capitalize } from 'lodash-es'
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
    router.push({ name: 'AAMevMonitor' })
  }

  const dataSource = ref<any>([])
  const latestBlock = computed(() => {
    if (queue.value.length > 0) {
      return last(queue.value).blockNum
    } else {
      return dataSource.value[0]?.blockNum || 0
    }
  })
  const loading = ref(false)
  function pollingData() {
    getList(false)
  }
  async function getList(init = true) {
    try {
      init && (loading.value = true)
      const res = await getMevTransaction(choosingChain.value, {
        perPage: init ? 10 : 999,
        page: 1,
        blockNum: latestBlock.value,
        // hack for slow request
        totalCount: 100
      })
      if (init) {
        dataSource.value = res?.mevInfos || []
        resume()
      } else {
        const arr = (res?.mevInfos || []).reverse()
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
  <my-card>
    <template #title>
      <span class="fw-700 text-18px">AA MEV Monitor</span>
    </template>
    <template #right>
      <div class="flex items-center">
        <div
          class="px-8px py-6px cursor-pointer bg-#f8f8f8 c-#60626a rd-4px hover:bg-#222 hover:c-#fff"
          @click="goMore"
        >
          <span class="fw-600">More</span>
          <svg-icon iconClass="turn" class="w-16px! h-16px!"></svg-icon>
        </div>
      </div>
    </template>
    <el-scrollbar height="374px" v-loading="loading">
      <TransitionTable
        v-if="dataSource.length > 0"
        :dataSource="dataSource"
        uniqueKey="victim,time"
      >
        <template #title>
          <th class="userop-it min-w-120px">
            <span>Type</span>
          </th>
          <th class="time-it min-w-150px">
            <span>Victim</span>
          </th>
          <th class="sender-it min-w-150px">
            <span>Attacker</span>
          </th>
          <th class="profit-it min-w-120px text-right!">
            <span>MEV Profits</span>
          </th>
        </template>
        <template #default="listItem">
          <td class="userop-it c-#93959C">
            <div
              class="inline-flex py-2px px-4px items-center gap-4px rd-4px mb-4px"
              :style="{
                color: MEVTypeMap[listItem.type]?.color || '#5D55F0',
                backgroundColor: MEVTypeMap[listItem.type]?.bg || '#F0F5FF'
              }"
            >
              <svg-icon
                :iconClass="`home-${
                  MEVTypeMap[listItem.type]?.icon || 'frontrun'
                }`"
                class="w-16px! h-16px!"
              ></svg-icon>
              <span>{{ MEVTypeMap[listItem.type]?.label || '' }}</span>
            </div>
            <div>
              <TimeAgo :time="listItem.time" />
            </div>
          </td>
          <td class="time-it">
            <div class="inline-flex flex-col items-start gap-4px">
              <CopyMe
                :hash="listItem.victim"
                class="c-#30754B"
                :routeInfo="{
                  name:
                    listItem.victimType === 'bundler'
                      ? 'BundlerInfo'
                      : 'AccountInfo',
                  params: {
                    [listItem.victimType === 'bundler' ? 'bundler' : 'account']:
                      listItem.victim
                  }
                }"
              />
              <span
                v-if="listItem.victimType?.length > 0"
                class="c-#fff px-4px py-2px rd-4px bg-#6EA7E9"
              >
                {{ capitalize(listItem.victimType) }}
              </span>
            </div>
          </td>
          <td class="sender-it c-#30754B">
            <CopyMe
              :hash="listItem.attacker"
              :routeInfo="{
                name: 'BundlerInfo',
                params: { bundler: listItem.attacker }
              }"
            />
          </td>
          <td>
            <div class="mb-4px text-right">
              <svg-icon
                :iconClass="choosingCoinLogo"
                class="w-16px! h-16px! mr-4px"
              ></svg-icon>
              <number-show
                :number="listItem.mevProfit"
                class="fw-600"
                format="0,0.[000000]"
              />
            </div>
            <div class="text-right">
              <number-show
                :number="listItem.mevProfitUsd"
                format="{&asymp;$}0,0.[000]"
                class="c-#93959C"
              />
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
