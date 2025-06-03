<template>
    <router-view v-if="$route.params.courseId" /> <!-- Рендерим страницу курса -->

    <Layout v-else>
        <h1>Курсы</h1>

        <div class="courses">
            <Card v-for="course in courses" :key="course.id" @click="goToCourse(course)">
                <div class="top">
                    <img class="avatar" width :src="course.photo || '/image.png'" alt="avatar">
                    <span class="name-of-course">{{ course.title }}</span>
                </div>
            </Card>
        </div>
        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" />

        <Loading v-if="isLoading" />

    </Layout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { inject, onMounted, provide, ref } from "vue";
import { getCourses } from "@/api/modules/courses.api";

import Layout from '@/layouts/Layout.vue'
import Card from '@/components/Card.vue'
import Loading from "@/components/Loading.vue";

import Popup from "@/components/Popup.vue";

const courses = inject('courses')

const router = useRouter()

const showPopup = ref(false)
const popupText = ref('')

const selectedCourse = ref(null)

const isLoading = inject('isLoading');

const goToCourse = (course) => {
    selectedCourse.value = course
    router.push(`/courses/${selectedCourse.value.id}/practicants`)
}

provide('selectedCourse', selectedCourse)
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}

.courses {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 15px 0;

    .card {
        width: calc(50% - 5px) !important;

        cursor: pointer;

        .top {
            width: 100%;
            display: flex;
            gap: 10px;
            // justify-content: space-between;
            align-items: flex-start;

            .name-of-course {
                flex: 1;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: 1px;
            }

            .avatar {
                width: 36px;
                height: auto;
                border-radius: 4px;
            }
        }
    }
}

@media (max-width:768px) {
    .card {
        width: 100% !important;
    }
}

@media (max-width:360px) {
    button.blue {
        width: 100% !important;
    }
}
</style>