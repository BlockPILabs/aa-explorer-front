<script setup lang="ts"></script>

<template>
  <section
    class="app-main bg-#f8f8f8 w-100% relative of-hidden px-24px py-24px"
  >
    <router-view v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
  .app-main {
    min-height: calc(100vh - 80px);
  }
  @media screen and (max-width: 768px) {
    .app-main {
      padding: 24px 12px;
    }
  }
</style>
