<template>
    <!-- <Layout :on-create-task="openCreateTaskModal"> -->
    <Layout>
        <h1>Оценки</h1>
        <Navbar :elements="navbarItems" />
        <div v-if="students.length > 0 && !isLoading">
            <h3>Студенты</h3>

            <div class="students">
                <Student v-for="student in students" :student="student" :key="student.id" />
            </div>
        </div>
        <Loading v-else-if="isLoading" />
        <div v-else-if="students.length === 0 && !isLoading" class="no-marks">
            <h2>Выставленных оценок нету</h2>
            <p>Посмотрите присланные работы практикантов и выставьте оценки за них</p>
            <button class="blue" @click="goToTasks">К заданиям</button>
        </div>
        <!-- <CreateTask v-if="showCreateTaskModal" @cancel="closeModal" :users="students" /> -->
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse } from '@/api/modules/courses.api';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Student from './components/Student.vue';
import Loading from '@/components/Loading.vue';
// import CreateTask from '../components/modals/CreateTask.vue';

const students = ref([])

const course = ref(null)

const isLoading = ref(false)
// const showCreateTaskModal = ref(false)

const router = useRouter()
const route = useRoute()

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

const goToTasks = () => {
    router.push(`/courses/${course.value.id}/tasks`)
}

const fetchStudents = async () => {
    try {
        isLoading.value = true
        course.value = await getCourse(route.params.courseId);
    } catch (err) {
        console.error('Ошибка при загрузке студентов:', err);
    } finally {
        isLoading.value = false
    }
};

onMounted(fetchStudents)
</script>

<style scoped lang="scss">
h3 {
    margin-top: 30px;
    font-weight: 600;
    font-size: 24px;
    line-height: 20px;
    letter-spacing: 0px;
}

.students {
    width: 870px;
    margin: 10px 0;
    border-radius: 8px;
    border: 1px solid #D9D9D9;

    .student {
        border-bottom: 1px solid #D9D9D9;

        &:last-child {
            border: none;
        }
    }
}

.no-marks {
    margin: 20px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: center;
}

@media (max-width: 930px) {
    .students {
        width: 100%;
    }
}
</style>