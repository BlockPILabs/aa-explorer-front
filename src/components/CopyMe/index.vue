<script setup lang="ts">
  import CopyIt from '../CopyIt/index.vue'
  import { formatHash } from '@/utils/formatHash'

  defineProps({
    hash: {
      type: String,
      default: ''
    },
    hideTip: {
      type: Boolean,
      default: false
    },
    routeInfo: {
      type: [Object, String],
      default: ''
    },
    copyIcon: {
      type: String,
      default: 'copy'
    }
  })
</script>

<template>
  <el-tooltip
    :content="hash"
    :disabled="hideTip"
    placement="top"
    :show-after="500"
  >
    <span class="copy-me" v-bind="$attrs">
      <router-link :to="routeInfo" v-if="routeInfo">
        {{ formatHash(hash) }}</router-link
      >
      <span v-else>{{ formatHash(hash) }}</span>
      <copy-it :words="hash" :copyIcon="copyIcon" class="ml-4px"></copy-it>
    </span>
  </el-tooltip>
</template>

<style lang="scss" scoped></style>
