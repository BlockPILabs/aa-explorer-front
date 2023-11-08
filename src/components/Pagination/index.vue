<template>
  <div :class="{ hidden: hidden }" class="pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :total="total"
    >
      <div
        class="pag-item"
        @click="goFirstPage"
        :class="{ 'is-disabled': currentPage <= 1 }"
      >
        <svg-icon iconClass="first_page" class="page-icon"></svg-icon>
      </div>
      <div
        class="pag-item"
        @click="goPrevPage"
        :class="{ 'is-disabled': currentPage <= 1 }"
      >
        <svg-icon iconClass="prev_page" class="page-icon"></svg-icon>
      </div>
      <div class="pag-item pager">
        <span>Page {{ currentPage }} of {{ totalPage }}</span>
      </div>
      <div
        class="pag-item"
        @click="goNextPage"
        :class="{ 'is-disabled': currentPage >= totalPage }"
      >
        <svg-icon iconClass="next_page" class="page-icon"></svg-icon>
      </div>
      <div
        class="pag-item"
        @click="goLastPage"
        :class="{ 'is-disabled': currentPage >= totalPage }"
      >
        <svg-icon iconClass="last_page" class="page-icon"></svg-icon>
      </div>
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'

  const props = defineProps({
    total: {
      required: true,
      type: Number as PropType<number>,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 15
    },
    layout: {
      type: String,
      default: 'slot'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:page', 'update:limit'])

  const currentPage = useVModel(props, 'page', emit)

  const pageSize = useVModel(props, 'limit', emit)

  function goFirstPage() {
    currentPage.value = 1
  }
  function goLastPage() {
    currentPage.value = totalPage.value
  }
  function goPrevPage() {
    if (currentPage.value === 1) return
    currentPage.value--
  }
  function goNextPage() {
    if (currentPage.value === totalPage.value) return
    currentPage.value++
  }
  const totalPage = computed(() => {
    return Math.max(Math.ceil(props.total / props.limit), 1)
  })
</script>

<style lang="scss" scoped>
  .pagination {
    &.hidden {
      display: none;
    }
  }
  .pag-item {
    padding: 1px 8px;
    margin-left: 10px;
    border-radius: 4px;
    background: #f5f5f5;
    color: #60626a;
    cursor: pointer;
    .page-icon {
      width: 24px;
      height: 24px;
    }
    &.pager {
      padding: 6px 8px;
      font-weight: 500;
    }
    &.is-disabled {
      color: #b8bac1;
      cursor: not-allowed;
    }
  }
</style>
