<template>
    <Layout>
        <h1>Задания</h1>
        <Navbar :elements="navbarItems" />
        <Loading v-if="isLoading" />
        <Tasks v-if="tasks.length > 0" :tasks="tasks" />
        <h3 v-if="tasks.length === 0 && !isLoading">Вы не пропустили срок сдачи ни одного задания</h3>
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { checkOverdueDeadline } from '@/utils/utils';
import { getTasks } from '@/api/modules/tasks.api';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Tasks from './components/Tasks.vue';
import Loading from '@/components/Loading.vue';

const tasks = ref([])
const isLoading = ref(false)

const fetchCurrentTasks = async () => {
    try {
        isLoading.value = true
        tasks.value = await getTasks()
        tasks.value = tasks.value.filter(task => new Date(task.until) < new Date())
    }
    catch (err) {
        console.log(err)
    } finally {
        isLoading.value = false
    }
}

const navbarItems = computed(() => {
    return [
        { name: 'Текущие', linkTo: `/tasks/current` },
        { name: 'Пропущен срок сдачи', linkTo: `/tasks/overdue` },
        { name: 'Выполнено', linkTo: `/tasks/done` }
    ];
});

onMounted(async () => {
    await fetchCurrentTasks()
})
</script>

<style scoped lang="scss">
h3 {
    margin-top: 20px;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 20px;
}
</style>