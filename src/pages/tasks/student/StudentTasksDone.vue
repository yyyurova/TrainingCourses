<template>
    <Layout>
        <h1>Задания</h1>
        <Navbar :elements="navbarItems" />
        <Loading v-if="isLoading" />
        <Tasks :tasks="tasks" />
        <h3 v-if="tasks.length === 0 && !isLoading">Вы не выполнили ни одного задания</h3>
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { getCourses } from '@/api/modules/courses';
import { getTasks } from '@/api/modules/tasks';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Tasks from './components/Tasks.vue';
import Loading from '@/components/Loading.vue';
import { getUserId } from '@/utils/auth';

const tasks = ref([])
const currentDate = new Date()
const isLoading = ref(false)

const fetchCurrentTasks = async () => {
    try {
        isLoading.value = true
        tasks.value = await getTasks()

        tasks.value = tasks.value.filter(task => {
            const studentTask = task.students.find(s => s.id === getUserId());
            return studentTask && studentTask.done === 1;
        });

        tasks.value = tasks.value.map(task => {
            const studentTask = task.students.find(s => s.id === getUserId());
            return {
                ...task,
                mark: studentTask?.mark || null
            };
        });
        tasks.value.sort(t => -t.id)
    } finally {
        isLoading.value = false
    }
}

const navbarItems = [
    { name: 'Текущие', linkTo: `/tasks/current` },
    { name: 'Пропущен срок сдачи', linkTo: `/tasks/overdue` },
    { name: 'Выполнено', linkTo: `/tasks/done` }
];

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
