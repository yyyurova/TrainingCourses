<template>
    <Layout :on-create-task="openCreateTaskModal">
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
        <CreateTask v-if="showCreateTaskModal" @cancel="closeModal" :users="students" />
    </Layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { mockUser } from '@/mocks/user';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Student from './components/Student.vue';
import Loading from '@/components/Loading.vue';
import CreateTask from '../components/modals/CreateTask.vue';

const students = ref([])

const course = ref(null)

const isLoading = ref(false)
const showCreateTaskModal = ref(false)

const router = useRouter()

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

const goToTasks = () => {
    router.push('/course/tasks')
}

const fetchStudents = async () => {
    try {
        isLoading.value = true
        const { data: courses } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses?teacher=${mockUser.id}`);
        course.value = courses[0];

        const membersParams = course.value.members.map(id => `id[]=${id}`).join('&');
        const url = `https://c1a9f09250b13f61.mokky.dev/users?${membersParams}`;

        const { data } = await axios.get(url);

        students.value = data
            .map(student => {
                const studentTasks = course.value.tasks
                    .filter(task =>
                        task.assignedTo.includes(student.id) &&
                        task.marks?.[student.id.toString()] !== null
                    )
                    .map(task => ({
                        ...task,
                        mark: task.marks[student.id.toString()]
                    }));

                return {
                    ...student,
                    tasks: studentTasks
                };
            })
            .filter(student => student.tasks.length > 0);
        console.log(students.value)
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