<template>
    <Layout>
        <h1>Мое обучение</h1>
        <Navbar :elements="navbarItems" />
        <div v-if="course && !isLoading">
            <div class="cards">
                <Card class="course">
                    <div class="top">
                        <img width="36px" height="36px" :src="course.imageUrl" alt="avatar">
                        <p class="name-of-course">{{ course.name }}</p>
                    </div>
                    <button class="blue">Продолжить обучение</button>
                </Card>
                <Card class="teacher">
                    <div class="top">
                        <p>Куратор</p>
                        <span class="teacher-name">{{ teacherName }}</span>
                    </div>
                    <button class="transparent">Написать сообщение</button>
                </Card>
            </div>
        </div>
        <Loading v-if="isLoading" />
        <div v-if="!course && !isLoading">
            <p>Курс не найден</p>
        </div>
    </Layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import Loading from '@/components/Loading.vue';
import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';

const route = useRoute();
const course = ref(null);
const isLoading = ref(false);
const teacherName = ref('');

const fetchTeacherName = async (teacherId) => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users/${teacherId}`);
        teacherName.value = data.name; // Берем только имя учителя
    } catch (err) {
        console.log(err);
        teacherName.value = 'Учитель не найден';
    }
};

const navbarItems = computed(() => {
    if (!course.value) return [];
    return [
        { name: 'Главная', linkTo: `/courses/${course.value.id}/my-study` },
        { name: 'Успеваемость', linkTo: `/courses/${course.value.id}/performance` },
        { name: 'Задания', linkTo: `/courses/${course.value.id}/tasks` }
    ];
});

const fetchCourse = async (id) => {
    try {
        isLoading.value = true;
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses/${id}`);
        course.value = data;

        if (data.teacher) {
            await fetchTeacherName(data.teacher);
        } else {
            teacherName.value = 'Учитель не назначен';
        }
    } catch (error) {
        console.error('Ошибка загрузки курса:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (route.params.id) {
        fetchCourse(route.params.id);
    }
});

watch(() => route.params.id, (newId) => {
    if (newId) {
        fetchCourse(newId);
    }
});

watch(() => course.value, () => {
    document.title = course.value.name
})
</script>

<style scoped lang="scss">
.cards {
    margin: 15px 0;
    display: flex;
    gap: 10px;

    .card {
        width: 50%;

        &.course {
            .top {
                width: 100%;
                display: flex;
                gap: 10px;
                align-items: center;
            }
        }
    }

    .top p {
        flex: 1;
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        letter-spacing: 1px;
    }

    .teacher-name {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
    }

    button {
        margin: 10px 0;
        height: 46px;


        &.transparent {
            border: 1px solid #513DEB;
        }
    }
}
</style>