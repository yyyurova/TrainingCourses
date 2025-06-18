<template>
    <router-view v-if="$route.params.courseId" />
    <div v-else>
        <Layout>
            <h1 v-if="courses && courses.length > 0">Курсы</h1>
            <div v-if="!isLoading && courses.length === 0" class="no-items">
                <p> У вас нет доступных курсов</p>
            </div>
            <div class="courses" v-if="courses && courses.length > 0">
                <Card v-for="course in courses" :key="course.id" @click="goToCourse(course.id)">
                    <div class="top">
                        <img v-if="course.photo" class="avatar" :src="course.photo" alt="avatar">
                        <AvatarLetter v-else :name="course.title" />
                        <span class="name-of-course">{{ course.title }}</span>
                    </div>
                    <button class="blue" @click.stop="continueStudy(course.id)">Продолжить обучение</button>
                </Card>
            </div>
            <Loading v-if="isLoading" />
        </Layout>

    </div>
</template>

<script setup>
import { inject, onMounted, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCourses } from '@/api/modules/courses.api';

import Loading from '@/components/Loading.vue';
import Layout from '@/layouts/Layout.vue';
import Card from '@/components/Card.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';

const courses = inject('courses')
const router = useRouter()
const isLoading = inject('isLoading')

const continueStudy = (id) => {
    router.push(`/courseCompletion/${id}`)
}

const goToCourse = (id) => {
    router.push(`/courses/${id}/my-study`)
}

provide('courses', courses)
// onMounted(async () => {
//     await fetchCourses()
// })
</script>

<style scoped lang="scss">
.no-items {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
}

.courses {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 15px 0;

    .card {
        cursor: pointer;
        justify-content: space-between;

        .top {

            width: 100%;
            display: flex;
            gap: 10px;
            // justify-content: space-between;
            align-items: center;

            .name-of-course {
                word-break: break-word;
                flex: 1;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: 1px;
            }

            .avatar {
                border-radius: 4px;
                width: 35px;
                height: auto;
                max-height: 36px;
                object-fit: cover;
            }
        }

        button.blue {
            margin: 10px 0;
            height: 46px;
        }
    }
}

@media (max-width:1280px) {
    .card {
        width: 49%;
    }
}

@media (max-width:550px) {
    .card {
        width: 100%;
    }
}
</style>