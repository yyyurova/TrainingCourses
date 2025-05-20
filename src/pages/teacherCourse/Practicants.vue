<template>
    <Layout>
        <h1>Практиканты</h1>
        <Navbar :elements="navbarItems" />
        <Card class="search no-hover">
            <img src="/icons/search.svg" alt="">
            <input type="text" placeholder="Начните вводить имя">
        </Card>
        <div class="practicants">
            <Card v-for="practicant in practicants" :key="practicant.id">
                <img :src="practicant.avatar || '/avatar.png'" alt="">
                {{ practicant.name }}
            </Card>
        </div>
    </Layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';

const practicants = ref([])

const navbarItems = [
    { name: 'Практиканты', linkTo: `/course/practicants` },
    { name: 'Задания', linkTo: `/course/tasks` },
    { name: 'Оценки', linkTo: `/course/marks` }
]

const fetchPracticants = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users?role=student`);
        practicants.value = data
        console.log(practicants.value)
    } catch (err) { console.log(err) }
}

onMounted(fetchPracticants)
</script>

<style scoped lang="scss">
.practicants {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .card {
        width: 32%;
        flex-direction: row;
        align-items: center;
        gap: 10px;

        img {
            width: 36px;
            height: auto;
        }
    }
}

.card.search {
    width: 300px;
    margin: 10px 0;
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;

    input {
        padding: 5px;
        border: none;
        outline: none;
    }
}
</style>