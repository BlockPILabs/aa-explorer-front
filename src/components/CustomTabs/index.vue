<script setup lang="ts">
  const props = defineProps({
    tabs: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    currTab: {
      type: [String, Number],
      default: ''
    }
  })
  const emits = defineEmits(['handleChoose'])
  function handChoose(val) {
    emits('handleChoose', val)
  }
</script>

<template>
  <div
    class="flex items-center px-4px py-4px rd-4px bg-#f8f8f8 c-#93959C of-auto"
  >
    <div
      v-for="item in tabs"
      :key="item.value"
      class="flex items-center tab-tag px-8px py-6px rd-4px cursor-pointer mr-4px last:mr-0px"
      :class="{ 'active-tab': currTab === item.value }"
      @click="handChoose(item.value)"
    >
      <svg-icon
        v-if="item.icon"
        :iconClass="item.icon"
        class="mr-4px w-16px! h-16px! tab-icon"
      ></svg-icon>
      <span class="tab-label" style="white-space: nowrap">{{
        item.label
      }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tab-tag {
    &:hover,
    &.active-tab {
      color: #fff;
      background: #222;
    }
  }
  @media screen and (max-width: 768px) {
    .tab-tag {
      flex-direction: column;
    }
  }
</style>
