<template>
    <Layout>
        <h1>Успеваемость</h1>
        <Navbar :elements="navbarItems" />
        <div v-if="!isLoading">
            <h3>Тесты</h3>
            <div class="success">
                <div class="row">
                    <Card class="center no-hover">
                        <p class="label">Количество тестов</p>
                        <p class="number">{{ mockUser.tests.all }}</p>
                    </Card>
                </div>
                <div class="row">
                    <Card class="no-hover">
                        <p class="label">Процент пройденных тестов</p>
                        <p class="number">{{ passedTests }}%</p>
                        <p class="period">За последние 4 недели</p>
                    </Card>
                    <Card class="no-hover">
                        <p class="label">Процент не пройденных тестов</p>
                        <p class="number">{{ failedTests }}%</p>
                        <p class="period">За последние 4 недели</p>
                    </Card>
                    <Card class="no-hover">
                        <p class="label">Средний балл за тесты</p>
                        <p class="number">{{ mockUser.tests.averageMark }}</p>
                        <p class="period">За последние 4 недели</p>
                    </Card>
                </div>
            </div>
        </div>
        <Loading v-if="isLoading" />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { mockUser } from '@/mocks/user';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Loading from '@/components/Loading.vue';
import Card from '@/components/Card.vue';

const course = ref(null)
const route = useRoute();
const isLoading = ref(false)

const passedTests = Math.round(mockUser.tests.pass / mockUser.tests.all * 100)
const failedTests = Math.round((mockUser.tests.all - mockUser.tests.pass) / mockUser.tests.all * 100)

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
h3 {
    margin: 20px 0 10px 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 1px;
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
            /* text-align: center; */
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