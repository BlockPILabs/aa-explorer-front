<script setup lang="ts">
  const featureList = ref(null)
  const listHeight = ref('0px')
  const { height } = useWindowSize()
  async function calcHeight() {
    await nextTick()
    const { top } = useElementBounding(featureList)
    listHeight.value = height.value - top.value - 30 + 'px'
  }
  watch(height, () => {
    calcHeight()
  })
  onMounted(() => {
    calcHeight()
  })
</script>

<template>
  <div
    ref="featureList"
    class="feature-list rd-12px bg-#fff w-240px flex flex-col flex-shrink-0"
  >
    <div class="list-title px-16px pt-16px flex-shrink-0">
      <slot name="title"></slot>
    </div>
    <el-scrollbar class="flex-grow-1 px-16px py-16px">
      <div class="list-content">
        <slot></slot>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
  .feature-list {
    height: v-bind(listHeight);
    :deep() {
      .list-content > div {
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        .label {
          color: #60626a;
          margin-bottom: 8px;
        }
        .value {
          color: #303030;
          font-weight: 600;
          font-size: 18px;
        }
        .sub-value {
          color: #303030;
          font-size: 13px;
          margin-top: 4px;
        }
        .pure-text {
          color: #60626a;
          font-weight: 500;
          margin-left: 4px;
        }
      }
      $colors: #eae7fb, #d0f1d0, #f1ddef, #dcf1f6, #f7f0b6, #fde0be;
      @for $i from 1 through length($colors) {
        $item: nth($colors, $i);
        .list-content > div {
          &:nth-child(6n + #{$i}) {
            background: $item;
          }
        }
      }
    }
  }
  @media screen and (max-width: 992px) {
    .feature-list {
      width: 100%;
      height: auto !important;
    }
  }
  @media screen and (max-width: 768px) {
    .summary-list {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
