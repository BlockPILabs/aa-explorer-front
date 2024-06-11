<script setup lang="tsx">
  import CustomTabs from '@/components/CustomTabs/index.vue'
  import { flattenDeep } from 'lodash-es'
  const props = defineProps({
    useropDetail: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  })

  const tabs = [
    { label: 'Analysis', value: 'analysis' },
    { label: 'Origin', value: 'origin' }
  ]
  const currTab = ref('analysis')
  function handChoose(val) {
    currTab.value = val
  }
  const showMore = ref(false)
  const calcList = computed(() => {
    const detail = props.useropDetail
    const prevList = [
      { name: 'sender', type: 'address', data: detail.sender },
      { name: 'nonce', type: 'uint256', data: detail.nonce },
      { name: 'initCode', type: 'bytes', data: detail.initCode },
      { name: 'calldata', type: 'EXPAND', data: '' }
    ]

    const suffixList = [
      { name: 'callGasLimit', type: 'uint256', data: detail.callGasLimit },
      {
        name: 'verificationGasLimit',
        type: 'uint256',
        data: detail.verificationGasLimit
      },
      {
        name: 'preVerificationGas',
        type: 'uint256',
        data: detail.preVerificationGas
      }
    ]
    let midList = []
    if (showMore.value) {
      const arr = (detail.callData || []).map((item, index) => {
        return [
          {
            name: '',
            type: `${index + 1}: target`,
            data: item.target
          },
          {
            name: '',
            type: `${index + 1}: value`,
            data: item.txValue
          },
          {
            name: '',
            type: `${index + 1}: calldata`,
            data: item.calldata
          }
        ]
      })
      midList = flattenDeep(arr)
    }
    return [...prevList, ...midList, ...suffixList]
  })
  function handleToggle() {
    showMore.value = !showMore.value
  }
  const tableCol = computed(() => {
    return [
      {
        label: 'Name',
        render: ({ row }) => {
          return <span class='c-#93959C'>{row.name || ''}</span>
        }
      },
      {
        label: 'Type',
        render: ({ row }) => {
          if (row.type === 'EXPAND') {
            if (showMore.value) {
              return (
                <div
                  class='c-#30754B cursor-pointer flex items-center'
                  onClick={handleToggle}
                >
                  <span>Click to see less</span>
                  <svg-icon
                    iconClass='ic_minus'
                    class='w-20px! h-20px! ml-4px'
                  ></svg-icon>
                </div>
              )
            } else {
              return (
                <div
                  class='c-#30754B cursor-pointer flex items-center'
                  onClick={handleToggle}
                >
                  <span>Click to see more</span>
                  <svg-icon
                    iconClass='ic_plus'
                    class='w-20px! h-20px! ml-4px'
                  ></svg-icon>
                </div>
              )
            }
          } else {
            return <span class='c-#60626a'>{row.type || ''}</span>
          }
        }
      },
      {
        label: 'Data',
        render: ({ row }) => {
          return <span class='c-#60626a'>{row.data || ''}</span>
        }
      }
    ]
  })
</script>

<template>
  <div v-loading="loading">
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>Entry Point</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <span class="c-#30754B mr-4px break-all">{{
            useropDetail.entryPoint
          }}</span>
          <copy-it :words="useropDetail.entryPoint"></copy-it>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" align="middle" class="no-border">
      <el-col :md="6">
        <div class="label">
          <span>Calldata</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div class="flex items-center">
          <CustomTabs
            :tabs="tabs"
            :currTab="currTab"
            @handleChoose="handChoose"
          ></CustomTabs>
          <copy-it :words="useropDetail.calldata" class="ml-100px"></copy-it>
        </div>
      </el-col>
    </el-row>
    <transition name="fade" mode="out-in">
      <template v-if="currTab === 'origin'">
        <div class="rd-8px bg-#f5f5f5 px-16px py-16px c-#93959c break-all">
          <span>{{ useropDetail.calldata }}</span>
        </div>
      </template>
      <template v-else>
        <titan-table
          class="c-#60626a"
          :data="calcList"
          :columns="tableCol"
          hide-empty
        ></titan-table>
      </template>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
  .label {
    color: #93959c;
  }
  .el-row {
    border-bottom: 1px solid #f5f5f5;
    padding-top: 16px;
    padding-bottom: 16px;
    &.no-border {
      border-bottom: none;
    }
  }
</style>
