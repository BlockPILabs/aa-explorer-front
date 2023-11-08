<script setup lang="ts">
  const props = defineProps({
    dataSource: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    titleHeight: {
      type: String,
      default: '45px'
    },
    uniqueKey: {
      type: String,
      default: 'number'
    }
  })
  function calcKey(item) {
    const keys = props.uniqueKey.split(',')
    let key = ''
    keys.forEach((it) => {
      key += item[it]
    })
    return key
  }
</script>

<template>
  <div class="transition-list relative z-1">
    <div
      class="transition-list__title sticky top-0 left-0 z-2 w-full bg-#f7f7f7 b-t-1px b-b-1px b-solid b-#edecec py-14px px-16px"
    >
      <slot name="title"></slot>
    </div>
    <transition-group name="list" tag="ul" class="transition-list__content">
      <li
        v-for="item in dataSource"
        :key="calcKey(item)"
        class="b-b-1px b-solid b-#edecec py-12px px-16px"
      >
        <slot v-bind="item"></slot>
      </li>
    </transition-group>
  </div>
</template>

<style scoped lang="scss">
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-leave-active {
    position: absolute;
  }
  .list-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .transition-list {
    &__title {
      height: v-bind(titleHeight);
    }
  }
</style>
