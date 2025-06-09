<template>
    <Layout>
        <h1>Оценки</h1>
        <Navbar :elements="navbarItems" />
        <div v-if="students && students.length > 0 && !isLoading">
            <h3>Студенты</h3>

            <div class="students">
                <Student v-for="student in students" :student="student" :key="student.id" />
            </div>
        </div>
        <Loading v-else-if="isLoading" />
        <div v-else-if="(!students && !isLoading) || (students.length === 0 && !isLoading)" class="no-marks">
            <h2>Выставленных оценок нету</h2>
            <p>Посмотрите присланные работы практикантов и выставьте оценки за них</p>
            <button class="blue" @click="goToTasks">К заданиям</button>
        </div>
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPracticants } from '@/api/modules/curarorStudents.api';
import { getTasksByCourse } from '@/api/modules/tasks.api';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Student from './components/Student.vue';
import Loading from '@/components/Loading.vue';

const students = ref([])

const isLoading = ref(false)

const router = useRouter()
const route = useRoute()

const courseId = route.params.courseId

const navbarItems = [
    { name: 'Практиканты', linkTo: `/courses/${courseId}/practicants` },
    { name: 'Задания', linkTo: `/courses/${courseId}/tasks` },
    { name: 'Оценки', linkTo: `/courses/${courseId}/marks` },
    { name: 'Содержание курса', linkTo: `/courses/${courseId}/content` }
];

const goToTasks = () => {
    router.push(`/courses/${courseId}/tasks`)
}

const fetchStudents = async () => {
    try {
        isLoading.value = true;


        students.value = await getPracticants(route.params.courseId);
        const tasks = await getTasksByCourse(route.params.courseId);

        const tasksByStudentId = new Map();

        if (students.value) {
            tasks.forEach(task => {
                task.students.forEach(studentTask => {
                    if (!tasksByStudentId.has(studentTask.id)) {
                        tasksByStudentId.set(studentTask.id, []);
                    }

                    const taskData = {
                        taskId: task.id,
                        name: task.name,
                        text: task.text,
                        mark: studentTask.mark,
                        until: task.until
                    };

                    tasksByStudentId.get(studentTask.id).push(taskData);
                });
            });

            students.value = students.value.map(student => {
                return {
                    ...student,
                    tasks: tasksByStudentId.get(student.id) || []
                };
            });
            students.value = students.value.filter(student =>
                student.tasks.length > 0 &&
                student.tasks.every(task => task.mark !== null)
            )
        }
    } catch (err) {
        console.error('Ошибка при загрузке студентов:', err);
    } finally {
        isLoading.value = false;
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