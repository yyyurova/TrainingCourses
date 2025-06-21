<template>
    <Layout>
        <h1>Успеваемость</h1>

        <Navbar :elements="navbarItems" />

        <div v-if="!isLoading">
            <div class="tests" v-if="testsStatiscics">
                <h3>Тесты</h3>

                <div class="success">
                    <div class="row">
                        <Card class="center no-hover">
                            <p class="label">Количество тестов</p>
                            <p class="number">{{ testsStatiscics.tests }}</p>
                        </Card>
                    </div>

                    <div class="row">
                        <Card class="no-hover">
                            <p class="label">Процент пройденных тестов</p>
                            <p class="number">{{ testsStatiscics.doneTests }}%</p>
                            <p class="period">За последние 4 недели</p>
                        </Card>

                        <Card class="no-hover">
                            <p class="label">Процент не пройденных тестов</p>
                            <p class="number">{{ testsStatiscics.notDoneTests }}%</p>
                            <p class="period">За последние 4 недели</p>
                        </Card>

                        <Card class="no-hover">
                            <p class="label">Средний балл за тесты</p>
                            <p class="number">{{ testsStatiscics.averageMark }}</p>
                            <p class="period">За последние 4 недели</p>
                        </Card>
                    </div>
                </div>
            </div>

            <div class="hometasks" v-if="tasksStatistics">
                <h3>Домашние задания</h3>
                <div class="success">
                    <div class="row">
                        <Card class="center no-hover">
                            <p class="label">Количество домашних заданий</p>
                            <p class="number">{{ tasksStatistics.tasks }}</p>
                        </Card>
                    </div>

                    <div class="row">
                        <Card class="no-hover">
                            <p class="label">Процент сделанных домашних заданий</p>
                            <p class="number">{{ tasksStatistics.done !== 0 ? tasksStatistics.done /
                                tasksStatistics.tasks
                                *
                                100 : 0 }}%</p>
                            <p class="period">За последние 4 недели</p>
                        </Card>

                        <Card class="no-hover">
                            <p class="label">Процент не сделанных домашних заданий</p>
                            <p class="number">{{ tasksStatistics.not_done !== 0 ?
                                tasksStatistics.not_done / tasksStatistics.tasks * 100 : 0 }}%</p>
                            <p class="period">За последние 4 недели</p>
                        </Card>

                        <Card class="no-hover">
                            <p class="label">Средний балл</p>
                            <p class="number">{{ tasksStatistics.average_mark || 0 }}</p>
                            <p class="period">За последние 4 недели</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>

        <Loading v-if="isLoading" />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getCourse } from '@/api/modules/courses';
import { getTasksStatistics, getTestsStatistics } from '@/api/modules/activity';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Loading from '@/components/Loading.vue';
import Card from '@/components/Card.vue';

const course = ref(null)
const tasksStatistics = ref(null)
const testsStatiscics = ref(null)

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
        course.value = await getCourse(id);

        tasksStatistics.value = await getTasksStatistics(course.value.id)
        testsStatiscics.value = await getTestsStatistics(course.value.id)
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (route.params.courseId) {
        fetchCourse(route.params.courseId);
    }
});

watch(() => course.value, () => {
    document.title = course.value.title
})

</script>

<style scoped lang="scss">
h3 {
    margin: 20px 0 10px 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 1px;
}

.hometasks {
    margin-bottom: 20px;
}

.success {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .row {
        width: 100%;
        display: flex;
        gap: 10px;

        .card {
            width: 100%;

            &.center {
                align-items: center;
            }
        }

        &:first-child {
            .card {
                flex: 0 0 100%;
            }
        }

        &:not(:first-child) {
            .card {
                flex: 1;
            }
        }

        .label {
            display: flex;
            align-items: center;
            flex: 1;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0%;
            color: #292929;
        }

        .number {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            letter-spacing: 1%;
            text-align: center;
            margin: 5px 0px;
        }

        .period {
            color: #787878;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0px;
        }

        @media (max-width: 480px) {
            flex-wrap: wrap;

            &:first-child {
                .card {
                    flex: 0 0 100%;
                }
            }

            &:not(:first-child) {
                .card {
                    flex: 0 0 calc(50% - 5px);

                    &:nth-child(3) {
                        align-items: center;
                        flex: 0 0 100%;
                    }
                }
            }
        }
    }
}
</style>