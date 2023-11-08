<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()
  function handleBack() {
    if (router.options.history.state.back) {
      router.back()
    } else {
      router.push('/')
    }
  }
</script>

<template>
  <div
    class="inline-flex items-center bg-#eee rd-4px justify-center mr-24px px-16px py-8px c-#60626A hover:bg-#222 hover:c-#fff cursor-pointer"
    @click="handleBack"
  >
    <svg-icon iconClass="arrow_back" class="w-20px! h-20px!"></svg-icon>
    <span class="text-16px fw-600 ml-8px">Back</span>
  </div>
</template>

<style lang="scss" scoped></style>
