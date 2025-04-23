<template>
    <Layout>
        <h1>Курсы</h1>
        <div>
            <Card v-for="course in courses" :key="course.id" :course="course" />
        </div>
    </Layout>
</template>

<script setup>
import axios from "axios";

import Layout from '../layouts/Layout.vue'
import Card from '../components/Card.vue'
import { onMounted, ref } from "vue";

const courses = ref([])

onMounted(async () => {
    const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses`)
    courses.value = data.map(obj => ({
        ...obj,

    }))
})

</script>