<script setup>
import { onMounted, ref } from 'vue';
import { initRouter } from '@/router';

const isRouterReady = ref(false);

onMounted(async () => {
  initRouter();
  isRouterReady.value = true;
});
</script>

<template>
  <RouterView v-if="isRouterReady" />
</template>

<style scoped></style>
