<template>
  <div
    class="menu-switcher cursor-pointer w-24px h-24px fixed z-1002 top-90px sidebar-switch rd-12px bg-white flex items-center justify-center"
    :class="{ 'is-active': isActive }"
    @click="toggleClick"
  >
    <svg-icon iconClass="fold" class="hamburger"></svg-icon>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    isActive: {
      required: true,
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['toggleClick'])

  function toggleClick() {
    emit('toggleClick')
  }
</script>

<style lang="scss" scoped>
  .sidebar-switch {
    left: calc(48px - 12px);
    transition: left 0.28s;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    &.is-active {
      left: calc($sideBarWidth - 12px) !important;
      .hamburger {
        transform: rotate(0deg);
      }
    }
  }
  .hamburger {
    width: 12px;
    height: 12px;
    color: #fff;
    transform: rotate(180deg);
    transition: transform 0.28s;
  }
</style>
