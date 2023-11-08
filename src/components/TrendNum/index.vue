<template>
  <span class="trend-num">
    <span
      v-if="!Number.isNaN(num) && num !== 0 && absNum !== Infinity"
      class="rating"
      :class="{ descending: num < 0 }"
    >
      <template v-if="text">
        <span>{{ label }}</span>
      </template>
      <template v-else>
        <i v-if="num < 0" class="el-icon-caret-bottom" />
        <i v-else class="el-icon-caret-top" />
        <span>{{ absLabel }}</span>
      </template>
    </span>
    <span v-else>--</span>
  </span>
</template>

<script>
  export default {
    name: 'TrendNum',
    props: {
      text: {
        type: Boolean,
        default: false
      },
      num: {
        type: Number,
        default: 1
      },
      suffix: {
        type: String,
        default: '%'
      },
      brackets: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      absNum() {
        return Math.abs(this.num)
      },
      label() {
        return this.brackets
          ? `(${this.num}${this.suffix})`
          : `${this.num}${this.suffix}`
      },
      absLabel() {
        return this.brackets
          ? `(${this.absNum}${this.suffix})`
          : `${this.absNum}${this.suffix}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rating {
    color: #25c796;
    &.descending {
      color: #df5f5f;
    }
  }
</style>
