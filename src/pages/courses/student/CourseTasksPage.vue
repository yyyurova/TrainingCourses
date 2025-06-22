<template>
    <Layout>
        <h1>Задания</h1>

        <Navbar :elements="navbarItems" />

        <div class="tasks" v-if="tasks && !isLoading && tasks.length > 0">
            <Card v-for="task in tasks" :key="task.id" @click="goToTask(task.id)">
                <img src="/icons/sidebar/task.svg" alt="">

                <div class="text">
                    <p class="name-of-task">
                        {{ task.name }}
                    </p>

                    <p class="bottom-row">
                        <span :class="{ 'overdue': checkOverdueDeadline(task.until) }">
                            {{ format(task.until, { date: 'long' }) }}
                        </span>
                        <span v-if="task.mark" class="mark">Оценка: {{ task.mark }}</span>
                    </p>
                </div>
            </Card>
        </div>

        <div class="no-tasks" v-else-if="tasks && tasks.length === 0 && !isLoading">
            <h2>Домашних заданий нет</h2>
            <p>Здесь будут появляться домашние задания от вашего куратора</p>
        </div>

        <Loading v-else-if="isLoading" />
    </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from '@formkit/tempo';
import { checkOverdueDeadline } from '@/utils/utils';
import { getCourse } from '@/api/modules/courses';
import { getTasks } from '@/api/modules/tasks';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Loading from '@/components/Loading.vue';

const course = ref(null)
const tasks = ref([])

const route = useRoute();
const router = useRouter()

const isLoading = ref(false)

const navbarItems = computed(() => {
    if (!course.value) return [];
    return [
        { name: 'Главная', linkTo: `/courses/${course.value.id}/my-study` },
        { name: 'Успеваемость', linkTo: `/courses/${course.value.id}/performance` },
        { name: 'Задания', linkTo: `/courses/${course.value.id}/tasks` }
    ];
});

const fetchCourse = async () => {
    try {
        isLoading.value = true
        course.value = await getCourse(route.params.courseId)
    }
    finally {
        isLoading.value = false
    }
}

const goToTask = (id) => {
    router.push(`/tasks/${id}`)
}

const fetchTasks = async () => {
    try {
        isLoading.value = true
        tasks.value = await getTasks({ course: course.value.id })
        tasks.value.sort(t => -t.id)
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await fetchCourse()
    await fetchTasks();
});
</script>

<style scoped lang="scss">
.no-tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-top: 30px;

    h2 {
        font-weight: 600;
        font-size: 36px;
        line-height: 42px;
        letter-spacing: 1px;
        text-align: center;
    }

    p {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: center;
    }
}

.tasks {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;

    .card {
        width: calc(50% - 5px);
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
        }
    }
}

@media (max-width:768px) {
    .tasks .card {
        width: 100% !important;
    }
}
</style>