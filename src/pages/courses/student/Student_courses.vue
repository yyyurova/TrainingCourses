<template>
    <router-view v-if="$route.params.id" /> <!-- Рендерим страницу курса -->
    <div v-else>
        <Layout>
            <h1>Курсы</h1>
            <div class="courses">
                <Card v-for="course in courses" :key="course.id">
                    <div class="top">
                        <img class="avatar" :src="course.imageUrl || '/image.png'" alt="avatar">
                        <span class="name-of-course">{{ course.title }}</span>
                    </div>
                    <button class="blue" @click="continueStudy(course.id)">Продолжить обучение</button>
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

const courses = inject('courses')
const router = useRouter()
const isLoading = ref(false)

// const fetchCourses = async () => {
//     try {
//         isLoading.value = true
//         courses.value = await getCourses()
//     } finally {
//         isLoading.value = false
//     }
// }

const continueStudy = (id) => {
    router.push(`/courseCompletion/${id}`)
}

// onMounted(async () => {
//     await fetchCourses()
// })
</script>

<style scoped lang="scss">
.courses {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 15px 0;

    .card {
        .top {
            width: 100%;
            display: flex;
            gap: 10px;
            // justify-content: space-between;
            align-items: center;

            .name-of-course {
                flex: 1;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: 1px;
            }

            .avatar {
                border-radius: 4px;
                width: 36px;
                height: 36px
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