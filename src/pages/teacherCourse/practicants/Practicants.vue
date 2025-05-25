<template>
    <Layout :on-create-task="openCreateTaskModal">
        <h1>Практиканты</h1>
        <Navbar :elements="navbarItems" />
        <Card class="search no-hover">
            <img src="/icons/search.svg" alt="">
            <input v-model="nameInput" @input="searchPracticant" type="text" placeholder="Начните вводить имя">
        </Card>
        <div v-if="practicants.length > 0 && !isLoading" class="practicants">
            <Card v-for="practicant in practicants" :key="practicant.id" @click="openTasks(practicant)">
                <img :src="practicant.avatar || '/avatar.png'" alt="">
                {{ practicant.name }}
            </Card>
        </div>
        <Loading v-if="isLoading" />
        <div v-else-if="practicants.length === 0 && !isLoading" class="no-pracricants">
            <h2>В данном курсе нет практикантов.</h2>
        </div>
        <CreateTask v-if="showCreateTaskModal" @cancel="closeModal" />
    </Layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { mockUser } from '@/mocks/user';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Loading from '@/components/Loading.vue';
import CreateTask from '../components/modals/CreateTask.vue';

const practicants = ref([])
const originalPracticants = ref([])
const course = ref(null)

const nameInput = ref('')

const router = useRouter()

const isLoading = ref(false)
const showCreateTaskModal = ref(false)

const navbarItems = [
    { name: 'Практиканты', linkTo: `/course/practicants` },
    { name: 'Задания', linkTo: `/course/tasks` },
    { name: 'Оценки', linkTo: `/course/marks` }
]

const closeModal = () => {
    if (showCreateTaskModal.value) { showCreateTaskModal.value = false }
}

const openCreateTaskModal = () => {
    showCreateTaskModal.value = true
}

const fetchPracticants = async () => {
    try {
        isLoading.value = true
        const { data: courses } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses?teacher=${mockUser.id}`);
        course.value = courses[0]

        const membersParams = course.value.members.map(id => `id[]=${id}`).join('&');
        const url = `https://c1a9f09250b13f61.mokky.dev/users?${membersParams}`;

        const { data } = await axios.get(url);
        practicants.value = data
        originalPracticants.value = data
    } catch (err) { console.log(err) }
    finally {
        isLoading.value = false
    }
}

const openTasks = (practicant) => {
    localStorage.setItem('course', JSON.stringify(course.value))
    router.push({
        path: `/course/practicants/${practicant.id}`,
        params: { practicantId: practicant.id }
    })
}

const searchPracticant = () => {
    if (!nameInput.value.trim()) {
        practicants.value = [...originalPracticants.value];
        return;
    }

    const searchTerm = nameInput.value.trim().toLowerCase();
    practicants.value = originalPracticants.value.filter(practicant =>
        practicant.name && practicant.name.toLowerCase().includes(searchTerm)
    )
}

onMounted(fetchPracticants)
</script>

<style scoped lang="scss">
.practicants {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;

    .card {
        cursor: pointer;
        width: calc(33% - 5px);
        flex-direction: row;
        align-items: center;
        gap: 10px;

        img {
            width: 36px;
            height: auto;
        }
    }
}

.no-pracricants {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
}

.card.search {
    width: calc(33% - 5px);
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