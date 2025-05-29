<script setup>
import { onMounted, ref } from 'vue';
import { initRouter } from '@/router';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRouterReady = ref(false);

onMounted(async () => {
  await initRouter();
  isRouterReady.value = true;

  // Если текущий маршрут не найден, перенаправляем на fallback
  if (!router.currentRoute.value.matched.length) {
    const role = localStorage.getItem('user_role');
    if (role === 'admin') {
      router.push('/users');
    } else if (role === 'curator') {
      router.push('/course/practicants');
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
