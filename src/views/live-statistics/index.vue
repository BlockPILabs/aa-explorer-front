<script setup lang="ts">
  import AaStatistics from './components/AaStatistics.vue'
  import UserOps from './components/UserOps.vue'
  import MevMonitor from './components/MevMonitor.vue'
  import TopCharacter from './components/TopCharacter.vue'
  import LatestBlocks from './components/LatestBlocks.vue'
  import TxnDomin from './components/TxnDomin.vue'
  defineOptions({
    name: 'LiveStatistics'
  })
</script>

<template>
  <div class="live-statistics">
    <AaStatistics></AaStatistics>
    <UserOps></UserOps>
    <el-row :gutter="16">
      <el-col :md="12" class="mt-16px">
        <MevMonitor></MevMonitor>
      </el-col>
      <el-col :md="12" class="mt-16px">
        <TopCharacter></TopCharacter>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :md="12" class="mt-16px">
        <LatestBlocks></LatestBlocks>
      </el-col>
      <el-col :md="12" class="mt-16px">
        <TxnDomin></TxnDomin>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
