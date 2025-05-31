<script setup>
import { onMounted, ref } from 'vue';
import { initRouter } from '@/router';
import { useRouter } from 'vue-router';
import { getUserRole } from './utils/auth';

const router = useRouter();
const isRouterReady = ref(false);

onMounted(async () => {
  await initRouter();
  isRouterReady.value = true;

  if (!router.currentRoute.value.matched.length) {
    const role = getUserRole()
    if (role === 'admin') {
      router.push('/users');
    } else if (role === 'curator') {
      router.push('/courses');
    } else {
      router.push('/courses');
    }
  }
});
</script>

<template>
  <RouterView v-if="isRouterReady" />
</template>

<style scoped></style>
