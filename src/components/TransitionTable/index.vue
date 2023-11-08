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
  <table class="transition-list">
    <thead
      class="transition-list__title sticky top--1px left-0 bg-#f7f7f7 b-t-1px b-b-1px b-solid b-#edecec"
    >
      <slot name="title"></slot>
    </thead>
    <transition-group name="list" tag="tbody" class="transition-list__content">
      <tr v-for="item in dataSource" :key="calcKey(item)">
        <slot v-bind="item"></slot>
      </tr>
    </transition-group>
  </table>
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
    width: 100%;
    word-wrap: break-word;
    border-spacing: 0;
    &__title {
      height: v-bind(titleHeight);
    }
    :deep() {
      th {
        color: #93959c;
        font-weight: 700;
        padding: 12px 16px;
        text-align: left;
      }
      td {
        padding: 12px 16px;
        border-bottom: 1px solid #edecec;
      }
    }
  }
</style>
