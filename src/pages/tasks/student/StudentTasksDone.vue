<template>
    <Layout>
        <h1>Задания</h1>
        <Navbar :elements="navbarItems" />
        <Tasks :tasks="tasks" />
    </Layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Tasks from './components/Tasks.vue';

const tasks = ref([])
const currentDate = new Date()

const fetchCurrentTasks = async () => {
    try {
        const { data: courses } = await axios.get('https://c1a9f09250b13f61.mokky.dev/courses')

        tasks.value = courses.flatMap(course =>
            course.tasks
                .filter(task => task.mark)
                .map(task => ({
                    ...task,
                    courseId: course.id,
                }))
        )
    }
    catch (err) {
        console.log(err)
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
