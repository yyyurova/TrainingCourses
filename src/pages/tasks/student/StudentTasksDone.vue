<template>
    <Layout>
        <h1>Задания</h1>
        <Navbar :elements="navbarItems" />
        <Loading v-if="isLoading" />
        <Tasks :tasks="tasks" />
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { getCourses } from '@/api/modules/courses.api';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Tasks from './components/Tasks.vue';
import Loading from '@/components/Loading.vue';

const tasks = ref([])
const currentDate = new Date()
const isLoading = ref(false)

const fetchCurrentTasks = async () => {
    try {
        isLoading.value = true
        const courses = await getCourses()

        tasks.value = courses.flatMap(course =>
            course.tasks
                .filter(task => task.mark)
                .map(task => ({
                    ...task,
                    courseId: course.id,
                }))
        )
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
