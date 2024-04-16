<script setup lang="ts">
  const props = defineProps({
    network: {
      type: String,
      default: ''
    },
    networkObj: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    networkIcon: {
      type: String,
      default: ''
    }
  })
  const emits = defineEmits(['handle-command'])
  function handleCommand(obj) {
    emits('handle-command', obj)
  }
</script>

<template>
  <div>
    <el-dropdown trigger="click" @command="handleCommand" v-loading="loading">
      <el-button type="primary">
        <svg-icon :iconClass="networkIcon" class="w-16px! h-16px!"></svg-icon>
        <span class="ml-4px mr-8px"
          >{{ networkObj.chainName }}&nbsp;{{ networkObj.name }}</span
        >
        <svg-icon iconClass="expand"></svg-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in list" :command="item">
            <span>{{ item.chainName }}&nbsp;{{ item.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped></style>
