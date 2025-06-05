<template>
    <!-- <Layout :on-create-task="openCreateTaskModal"> -->
    <Layout>
        <h1>Практиканты</h1>
        <Navbar :elements="navbarItems" />
        <Card class="search no-hover">
            <img src="/icons/search.svg" alt="">
            <input v-model="nameInput" @input="searchPracticant" type="text" placeholder="Начните вводить имя">
        </Card>
        <div v-if="practicants && practicants.length > 0 && !isLoading" class="practicants">
            <Card v-for="practicant in practicants" :key="practicant.id" @click="openTasks(practicant)">
                <img v-if="practicant.avatar" :src="practicant.avatar" alt="">
                <AvatarLetter v-else :name="practicant.name" />
                {{ practicant.name }}
            </Card>
        </div>
        <Loading v-if="isLoading" />
        <div v-else-if="(!practicants && !isLoading) || (practicants.length === 0 && !isLoading)" class="no-items">
            <h2>В данном курсе нет практикантов.</h2>
        </div>
        <!-- <CreateTask v-if="showCreateTaskModal" @cancel="closeModal" :users="practicants" /> -->
    </Layout>
</template>

<script setup>
import { inject, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getPracticants } from '@/api/modules/curarorStudents.api';
import { getCourse } from '@/api/modules/courses.api';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Loading from '@/components/Loading.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';
// import CreateTask from '../components/modals/CreateTask.vue';

const practicants = ref([])
const originalPracticants = ref([])
const course = ref(null)

const nameInput = ref('')

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
// const showCreateTaskModal = ref(false)

const navbarItems = computed(() => {
    if (!course.value) return [];

    return [
        { name: 'Практиканты', linkTo: `/courses/${course.value.id}/practicants` },
        { name: 'Задания', linkTo: `/courses/${course.value.id}/tasks` },
        { name: 'Оценки', linkTo: `/courses/${course.value.id}/marks` }
    ];
});

// const closeModal = () => {
//     if (showCreateTaskModal.value) { showCreateTaskModal.value = false }
// }

// const openCreateTaskModal = () => {
//     showCreateTaskModal.value = true
// }

const fetchPracticants = async () => {
    try {
        isLoading.value = true
        console.log(route.params.courseId)
        course.value = await getCourse(route.params.courseId)
        const data = await getPracticants(route.params.courseId);
        practicants.value = data;
        originalPracticants.value = data;
        console.log(practicants.value)
    } catch (err) { console.log(err) }
    finally {
        isLoading.value = false
    }
}

const openTasks = (practicant) => {
    router.push({
        path: `/courses/${course.value.id}/practicants/${practicant.id}`,
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