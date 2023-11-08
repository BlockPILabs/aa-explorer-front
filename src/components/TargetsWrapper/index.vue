<script setup lang="ts">
  const props = defineProps({
    usePop: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Number,
      default: 0
    },
    info: {
      type: Object,
      default: () => ({})
    }
  })
  const baseHash = computed(() => {
    return (props.info.targets || [])[0]
  })
  const restTargets = computed(() => {
    return (props.info.targets || []).slice(1)
  })
  const emits = defineEmits(['hidePopover', 'toggleShow'])
  function hidePopover(info) {
    emits('hidePopover', info)
  }

  function toggleShow(info) {
    emits('toggleShow', info)
  }
</script>

<template>
  <template v-if="usePop">
    <CopyMe
      :hash="baseHash"
      :routeInfo="{
        name: 'AccountInfo',
        params: { account: baseHash }
      }"
    />
    <el-popover
      placement="bottom-end"
      popper-class="target-popover"
      :width="148"
      trigger="click"
      :auto-close="autoClose"
      v-if="restTargets?.length > 0"
      @hide="hidePopover(info)"
    >
      <template #reference>
        <el-button
          class="ml-8px min-w-28px c-#fff py-0px! px-4px! h-17px!"
          type="primary"
          @click="toggleShow(info)"
        >
          <svg-icon
            :iconClass="info.visible ? 'minus' : 'plus'"
            class="w-10px! h-10px!"
          ></svg-icon>
          <span v-if="!info.visible" class="ml-2px">{{
            restTargets?.length
          }}</span>
        </el-button>
      </template>
      <template v-for="target in restTargets">
        <CopyMe
          class="c-#30754B mt-10px inline-block first-mt-0px"
          :hash="target"
          :routeInfo="{
            name: 'AccountInfo',
            params: { account: target }
          }"
        />
      </template>
    </el-popover>
  </template>
  <template v-else>
    <CopyMe
      :hash="baseHash"
      :routeInfo="{
        name: 'AccountInfo',
        params: { account: baseHash }
      }"
    />
    <el-button
      class="ml-8px w-28px c-#fff py-0px! px-4px! h-17px!"
      type="primary"
      @click="toggleShow(info)"
      v-if="restTargets?.length > 0"
    >
      <svg-icon
        :iconClass="info.visible ? 'minus' : 'plus'"
        class="w-10px! h-10px!"
      ></svg-icon>
      <span v-if="!info.visible" class="ml-2px">{{ restTargets?.length }}</span>
    </el-button>
    <div v-if="info.visible">
      <template v-for="target in restTargets">
        <CopyMe
          class="mt-10px inline-block first-mt-0px"
          :hash="target"
          :routeInfo="{
            name: 'AccountInfo',
            params: { account: target }
          }"
        />
      </template>
    </div>
  </template>
</template>

<style lang="scss">
  .target-popover {
    max-height: 184px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
