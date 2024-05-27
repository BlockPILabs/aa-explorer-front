<script setup lang="tsx">
  import { getTxDetail } from '@/api/modules/stat'
  import { utils } from 'ethers'
  import axios from 'axios'

  const props = defineProps({
    hash: {
      type: String,
      default: ''
    },
    choosingChain: {
      type: String,
      default: ''
    },
    coinIcon: {
      type: String,
      default: ''
    }
  })
  const txDetail: any = ref({})
  const detailLoading = ref(false)
  async function getDetail() {
    if (!props.hash) return
    try {
      detailLoading.value = true
      const res = await getTxDetail(props.choosingChain, {
        txHash: props.hash
      })
      txDetail.value = res
      initTx()
    } catch (error) {
      console.error(error)
    } finally {
      detailLoading.value = false
    }
  }
  let abiJson: any = ''
  async function getAbi() {
    if (!props.hash) return
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_PATH}json/erc4337-abi.json`
      )
      abiJson = res.data
    } catch (error) {
      console.error(error)
    }
  }
  let iface: any = null
  let txFuncInfo: any = null
  const methodId = ref('')
  const funcName = ref('')
  const funcDefi = ref('')
  const decodedData = ref<any>([])
  const showDecoded = ref(false)
  const hasDecoded = ref(false)
  function initTx() {
    iface = new utils.Interface(abiJson)
    methodId.value = (txDetail.value?.input || []).slice(0, 10)
    txFuncInfo = iface.getFunction(methodId.value)
    funcName.value = 'Function: ' + txFuncInfo.name
    const baseParams = txFuncInfo.inputs.map((it) => {
      return `${it.type} ${it.name}`
    })
    funcName.value += `(${baseParams.join(',')})`
  }
  function decodeData() {
    if (!hasDecoded.value) {
      const data = iface.decodeFunctionData(
        methodId.value,
        txDetail.value?.input || ''
      )
      const frags = iface.format(utils.FormatTypes.minimal)
      funcDefi.value = frags
        .find((o) => o.includes(txFuncInfo.name))
        .replace('function', 'Function')
      txFuncInfo.inputs.forEach((element) => {
        if (element.baseType === 'array') {
          element.components.forEach((ele) => {
            decodedData.value.push({
              name: `${element.name}.${ele.name}`,
              type: ele.type,
              value: data[element.name][0][ele.name]
            })
          })
        } else {
          decodedData.value.push({
            name: element.name,
            type: element.type,
            value: data[element.name]
          })
        }
      })
      hasDecoded.value = true
    }
    showDecoded.value = !showDecoded.value
  }
  watch(
    () => props.hash,
    () => {
      getDetail()
    }
  )
  onMounted(() => {
    getAbi()
    getDetail()
  })
  const codeType = ref('default')
  const viewWays = ref([
    { value: 'default', label: 'Default View' },
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'origin', label: 'Original' }
  ])
  function handleCommand(command) {
    codeType.value = command
  }

  const inputData = computed(() => {
    if (codeType.value === 'origin') {
      return txDetail.value.input
    } else if (codeType.value === 'default') {
      const content = (txDetail.value?.input || []).slice(10)
      let strArr: any[] = []
      const n = 64
      for (let i = 0, l = content.length; i < l / n; i++) {
        let a: any = content.slice(n * i, n * (i + 1))
        strArr.push(a)
      }
      let preText = `${funcName.value}\n\nMethod ID: ${methodId.value}\n\n`
      strArr.forEach((item, index) => {
        preText += `[${index}]: ${item}\n`
      })

      return preText
    } else {
      const inputBytes = (txDetail.value?.input || '')
        .slice(2)
        .match(/[\da-f]{2}/gi)
        .map((byte) => parseInt(byte, 16))
      const uint8Array = new Uint8Array(inputBytes)
      const textDecoder = new TextDecoder()
      const text = textDecoder.decode(uint8Array)
      return text
    }
  })
  const tableCols = ref<any>([
    {
      label: 'Name',
      prop: 'name',
      width: 180
    },
    {
      label: 'Type',
      prop: 'type',
      width: 100
    },
    {
      label: 'Data',
      prop: 'value',
      render: ({ row }) => {
        if (row.type === 'address') {
          return (
            <router-link
              class='c-#30754B'
              to={{ name: 'AccountInfo', params: { account: row.value } }}
            >
              {row.value}
            </router-link>
          )
        } else if (row.type === 'uint256') {
          return <number-show number={row.value._hex} />
        } else {
          return <span>{row.value}</span>
        }
      }
    }
  ])
</script>

<template>
  <div v-loading="detailLoading" class="pt-16px">
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>Transaction Hash</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <router-link
            class="c-#30754B mr-4px break-all"
            :to="{ name: 'TxInfo', params: { tx: props.hash } }"
            >{{ props.hash }}</router-link
          >
          <copy-it :words="props.hash"></copy-it>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>Source</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <el-tooltip
            :content="txDetail.source"
            placement="top"
            :disabled="!txDetail.source"
          >
            <span
              class="text-truncate inline-block px-8px py-2px c-#60626A rd-4px w-96px h-21px bg-#CBDAFA text-center"
            >
              {{ txDetail.source || 'Handle Ops' }}
            </span>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>From</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <span class="c-#30754B mr-4px break-all">{{
            txDetail.fromAddr
          }}</span>
          <copy-it :words="txDetail.fromAddr"></copy-it>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>To</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <span class="c-#30754B mr-4px break-all">{{ txDetail.toAddr }}</span>
          <copy-it :words="txDetail.toAddr"></copy-it>
        </div>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>Value</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <svg-icon :iconClass="coinIcon" class="w-16px! h-16px!"></svg-icon>
          <number-show
            :number="txDetail.value"
            format="0,0.[000000]"
            class="fw-600 mx-4px"
          ></number-show>
          <number-show
            class="pure-text"
            :number="txDetail.valueUsd"
            format="{($}0,0.[000]{)}"
          ></number-show>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>Fee</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div>
          <svg-icon :iconClass="coinIcon" class="w-16px! h-16px!"></svg-icon>
          <number-show
            :number="(txDetail.gasUsed * txDetail.gasPrice) / 1e18"
            format="0,0.[000000]"
            class="fw-600 mx-4px"
          ></number-show>
          <number-show
            class="pure-text"
            :number="
              (txDetail.gasUsed * txDetail.gasPrice * txDetail.tokenPriceUsd) /
              1e18
            "
            format="{($}0,0.[000]{)}"
          ></number-show>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="16" align="middle">
      <el-col :md="6">
        <div class="label">
          <span>Gas Limit & Usage by Txn</span>
        </div>
      </el-col>
      <el-col :md="18">
        <div class="flex items-center">
          <number-show :number="txDetail.gas"></number-show>
          <div class="vertical-divider w-1px h-17px bg-#93959c mx-10px"></div>
          <number-show :number="txDetail.gasUsed"></number-show>
          <number-show
            :number="txDetail.gasUsed / txDetail.gas"
            format="{(}0.[00]%{)}"
          ></number-show>
        </div>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <el-row :gutter="16">
      <el-col :md="6">
        <div class="label">
          <span>Input Data</span>
        </div>
      </el-col>
      <el-col :md="18">
        <el-input
          v-if="!showDecoded"
          type="textarea"
          class="code-textarea"
          :model-value="inputData"
          readonly
          :rows="10"
        ></el-input>
        <div v-else class="rd-8px bg-#f5f5f5">
          <div class="py-8px px-12px break-all">
            <span>{{ funcDefi }}</span>
          </div>
          <titan-table
            :data="decodedData"
            :columns="tableCols"
            :max-height="200"
          ></titan-table>
        </div>
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          v-show="!showDecoded"
        >
          <el-button type="primary" class="mt-10px">
            <span>View Input As</span>
            <svg-icon iconClass="expand"></svg-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in viewWays" :command="item.value">
                <span>{{ item.label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="decodeData" type="primary" class="mt-10px ml-10px">
          {{ showDecoded ? 'Switch Back' : 'Decode Input Data' }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .label {
    color: #93959c;
  }
  .el-row {
    margin-bottom: 16px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .divider {
    width: 100%;
    height: 1px;
    background: #edecec;
    margin-bottom: 16px;
  }
  .pure-text {
    color: #93959c;
  }
  .code-textarea {
    :deep() {
      .el-textarea__inner {
        background: #f5f5f5;
        border-radius: 8px;
      }
    }
  }
</style>
