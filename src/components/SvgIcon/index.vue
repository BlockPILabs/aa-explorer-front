<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  />

  <svg v-else aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
  const props = defineProps({
    prefix: {
      type: String,
      default: 'icon'
    },
    iconClass: {
      type: String,
      required: false,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '1em'
    },
    single: {
      type: Boolean,
      default: false
    }
  })
  const isExternal = computed(() => {
    const reg = /^(https?:|mailto:|tel:)/u
    return reg.test(props.iconClass)
  })
  const styleExternalIcon = computed(() => {
    if (props.single) {
      return {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`,
        'background-color': 'currentColor',
        'mask-size': 'cover'
      }
    } else {
      return {
        background: `url(${props.iconClass}) no-repeat 50% 50%`,
        'background-size': 'cover'
      }
    }
  })
  const symbolId = computed(() => `#${props.prefix}-${props.iconClass}`)
</script>

<style scoped>
  .svg-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: -0.15em;
    outline: none;
    fill: currentcolor;
  }
</style>
