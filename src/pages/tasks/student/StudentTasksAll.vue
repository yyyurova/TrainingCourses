<template>
    <Layout>
        <h1>Задания</h1>
        <Navbar :elements="navbarItems" />
        <Loading v-if="isLoading" />
        <Tasks v-else :tasks="tasks" />
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

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
        const { data: courses } = await axios.get('https://c1a9f09250b13f61.mokky.dev/courses')

        tasks.value = courses.flatMap(course =>
            course.tasks
                .filter(task => new Date(task.deadline) >= currentDate)
                .map(task => ({
                    ...task,
                    courseId: course.id,
                }))
        )
    }
    catch (err) {
        console.log(err)
    }
    finally {
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
