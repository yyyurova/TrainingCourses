<template>
    <Layout>
        <h1>Задания</h1>
        <Navbar :elements="navbarItems" />
        <div class="tasks" v-if="course && !isLoading">
            <RouterLink class="link" v-for="task in course.tasks" :key="task.id"
                :to="`/courses/${course.id}/tasks/${task.id}`">
                <Card>
                    <img src="/icons/task.svg" alt="">
                    <div class="text">
                        <p class="name-of-task">
                            {{ task.title }}
                        </p>
                        <p class="bottom-row">
                            <span :class="{ 'overdue': checkOverdueDeadline(task.deadline) }">
                                {{ format(task.deadline, { date: 'long' }) }}
                            </span>
                            <span v-if="task.mark" class="mark">Оценка: {{ task.mark }}</span>
                        </p>
                    </div>
                </Card>
            </RouterLink>
        </div>
        <Loading v-else />
    </Layout>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { format } from '@formkit/tempo';
import { checkOverdueDeadline } from '@/utils/utils';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Loading from '@/components/Loading.vue';

const course = ref(null)
const route = useRoute();
const isLoading = ref(false)

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

watch(() => course.value, () => {
    document.title = course.value.name
})

</script>

<style scoped lang="scss">
.tasks {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .link {
        text-decoration: none;
        width: fit-content;

        .card {
            display: flex;
            align-items: flex-start;
            flex-direction: row;
            gap: 10px;
            cursor: pointer;

            .text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 10px;

                .bottom-row {
                    display: flex;
                    gap: 15px;
                }

                p span {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                }

                .name-of-task {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;

                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .overdue {
                    color: #CD3232 !important;
                }
            }
        }
    }
}
</style>