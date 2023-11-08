<template>
  <svg-icon
    v-if="words"
    :icon-class="copied ? 'carbon_checkmark' : copyIcon"
    class="copy-it cursor-pointer"
    :class="{ 'show-tip relative c-#31D788': copied }"
    @click="handleCopy($event)"
    @mouseleave="handleLeave"
  />
</template>

<script lang="ts" setup>
  import useClipboard from 'vue-clipboard3'
  import { useTimeoutFn } from '@vueuse/core'

  const props = defineProps({
    words: {
      type: String,
      require: true,
      default: ''
    },
    tip: {
      type: String,
      default: 'Copied!'
    },
    delay: {
      type: Number,
      default: 1000
    },
    copyIcon: {
      type: String,
      default: 'copy'
    }
  })
  const copied = ref(false)
  const { toClipboard } = useClipboard()
  // let div: HTMLElement | null = null
  async function handleCopy(e: any) {
    e.stopPropagation()
    if (copied.value) {
      return
    }
    await toClipboard(props.words)
    // const { width, left, height, top } = e.target.getBoundingClientRect();
    // const x = left + width / 2;
    // const y = top + height / 2;
    // div = document.createElement('span');
    // div.innerText = props.tip;
    // div.className = 'copy-tip';
    // div.style.top = y + 15 + 'px';
    // div.style.left = x + 'px';
    // document.body.appendChild(div);

    copied.value = true
    useTimeoutFn(() => {
      copied.value = false
      // div && document.body.removeChild(div);
      // div = null;
    }, props.delay)
  }
  function handleLeave() {
    // div && document.body.removeChild(div);
    // div = null;
  }
</script>

<style lang="scss">
  .copy-tip {
    position: fixed;
    color: #303030;
    font-size: 12px;
    transform: translateX(-50%);
  }
</style>
