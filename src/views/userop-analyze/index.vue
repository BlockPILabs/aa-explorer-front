<script setup lang="ts">
  import SearchHash from '@/components/SearchHash/index.vue'
  import TypeChart from './components/TypeChart.vue'
  import HotTokenChart from './components/HotTokenChart.vue'
  import ContractChart from './components/ContractChart.vue'
  defineOptions({
    name: 'UseropAnalyze'
  })
</script>

<template>
  <div>
    <div class="mb-24px">
      <span class="fw-700 text-24px">UserOps Explorer</span>
    </div>
    <div class="filter w-377px">
      <SearchHash
        placeholder="Search userops hash / txn hash"
        :extra-params="{ searchUserOpAndTx: true }"
      ></SearchHash>
    </div>
    <div class="mt-16px tip c-#60626A fw-400">
      <span>Enter any UserOps or AA transaction hash to explore</span>
    </div>
    <TypeChart></TypeChart>
    <el-row :gutter="16">
      <el-col :md="12">
        <HotTokenChart></HotTokenChart>
      </el-col>
      <el-col :md="12">
        <ContractChart></ContractChart>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
