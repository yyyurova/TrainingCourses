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
        <h2>Успеваемость</h2>
        <Card class="calendar no-hover">
            <VCalendar :attributes="attrs" :from-page="{ month: 11, year: 2024 }" dot="false"
                :masks="{ title: 'MMMM YYYY', weekdays: 'WW' }" :first-day-of-week="2" />
        </Card>
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
import { mockUser } from '@/mocks/user';

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


const attrs = ref([
    {
        key: 'today',
        highlight: {
            color: '#513DEB',
            fillMode: 'solid',
            class: 'today-highlight',
        },
        dates: new Date(),
        order: 100
    },
    {
        key: 'active',
        dot: false,
        content: {
            class: 'active-day-content',
        },
        dates: mockUser.activeDays,
        order: 10
    },
]);

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

.calendar {
    padding: 0;
    width: 100%;
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;

    :deep(.vc-container) {
        --vc-accent-50: #513DEB;
        --vc-accent-100: #513DEB;
        border: none;
        font-family: inherit;

        .vc-highlights+.vc-dots .vc-dot {
            display: none !important;
        }

        .vc-header {
            button {
                background: transparent;
            }

            padding: 0;
            margin-bottom: 10px;

            .vc-base-icon {
                width: 30px;
                height: 30px;
                stroke-width: 1;
                stroke: #292929;
            }

            .vc-title {
                color: #292929;
                font-size: 24px;
                font-weight: 600;
                text-transform: capitalize;
            }
        }

        .vc-weeks {
            padding: 0;

            .vc-week {
                gap: 5px;
            }
        }

        .vc-weekday {
            text-transform: capitalize;
            color: #787878;
            font-weight: 400;
            font-size: 14px;
            padding-bottom: 8px;
            text-align: center;
        }

        .vc-day {
            min-height: 44px;
            position: relative;
            text-align: center;
            padding: 0 !important;


            &-content {
                border-radius: 4px;
                font-weight: 500;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                &:hover {
                    background-color: #E9F2FF;
                }

                &-content {
                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 4px;
                        width: 14px;
                        height: 14px;
                        background: transparent;
                        background-repeat: no-repeat;
                        background-position: center;
                    }
                }

                .active-day-content {
                    &::after {
                        background-image: url('/icons/active-day.svg');
                    }

                    &.today-highlight::after {
                        background-image: url('/icons/active-day-today.svg');
                    }
                }
            }

            .active-day-content {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;

                &::before {
                    content: '';
                    background-image: url('/icons/active-day.svg');
                    background-repeat: no-repeat;
                    width: 10px;
                    height: 15px;
                }
            }
        }

        .today-highlight {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;

            .active-day-content::before {
                background-image: url('/icons/active-day-today.svg');
            }
        }
    }
}
</style>