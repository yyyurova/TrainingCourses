<template>
    <Layout>
        <h1>Мое обучение</h1>
        <Navbar :elements="navbarItems" />
        <div class="page__inner" v-if="course && !isLoading">
            <div class="cards">
                <Card class="course">
                    <div class="top">
                        <img width="36px" height="36px" :src="course.imageUrl || '/image.png'" alt="avatar">
                        <p class="name-of-course">{{ course.title }}</p>
                    </div>
                    <button class="blue" @click="continueStudy(course.id)">Продолжить обучение</button>
                </Card>
                <Card class="teacher" v-if="teacherName">
                    <div class="top">
                        <p>Куратор</p>
                        <span class="teacher-name">{{ teacherName }}</span>
                    </div>
                    <button class="transparent border">Написать сообщение</button>
                </Card>
            </div>
            <h2>Активность</h2>
            <Card class="no-hover">
                <VCalendar v-if="activity" class="calendar" :attributes="calendarAttributes" :initial-page="currentPage"
                    trim-weeks :masks="{ title: 'MMMM YYYY', weekdays: 'WW' }" borderless transparent locale="ru">
                    <template #day-content="{ day }">
                        <div class="day-content">
                            <img v-if="isActiveDay(day)"
                                :src="isToday(day) ? '/icons/active-day-today.svg' : '/icons/active-day.svg'"
                                class="active-icon" />
                            <span class="day-number">{{ day.day }}</span>
                        </div>
                    </template>
                </VCalendar>
            </Card>
        </div>

        <Loading v-if="isLoading" />
        <div v-if="!course && !isLoading">
            <p>Курс не найден</p>
        </div>
    </Layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mockUser } from '@/mocks/user';
import { getCourseActivity } from '@/api/modules/activity.api';
import { getCourse } from '@/api/modules/courses.api';

import Loading from '@/components/Loading.vue';
import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';

const route = useRoute();

const course = ref(null);
const activity = ref(null)

const isLoading = ref(false);
const teacherName = ref('');

const router = useRouter()

const navbarItems = computed(() => {
    if (!course.value) return [];
    return [
        { name: 'Главная', linkTo: `/courses/${course.value.id}/my-study` },
        { name: 'Успеваемость', linkTo: `/courses/${course.value.id}/performance` },
        { name: 'Задания', linkTo: `/courses/${course.value.id}/tasks` }
    ];
});

const continueStudy = (id) => {
    router.push(`/courseCompletion/${id}`)
}

const fetchCourse = async (id) => {
    try {
        isLoading.value = true;
        course.value = await getCourse(id);
        teacherName.value = course.value.curator_name


    } catch (error) {
        console.error('Ошибка загрузки курса:', error);
    } finally {
        isLoading.value = false;
    }
};

const fetchCourseActivity = async () => {
    try {
        activity.value = await getCourseActivity(course.value.id)
        console.log(activity.value)
    } finally {
        isLoading.value = false
    }
}

const calendarAttributes = computed(() => [
    {
        key: 'activeDays',
        // dates: mockUser.activeDays.map(date => new Date(date)),
        dates: new Date(activity.value.updated_at)
    },
    {
        key: 'today',
        class: 'today-cell',
        dates: new Date(),
    },
]);

const isActiveDay = (day) => {
    return mockUser.activeDays.some(activeDate => {
        const activeDay = new Date(activeDate);
        return activeDay.getFullYear() === day.year &&
            activeDay.getMonth() + 1 === day.month &&
            activeDay.getDate() === day.day;
    });
};

const isToday = (day) => {
    const today = new Date();
    return day.year === today.getFullYear() &&
        day.month === today.getMonth() + 1 &&
        day.day === today.getDate();
};

const currentPage = computed(() => {
    const today = new Date();
    return {
        month: today.getMonth() + 1,
        year: today.getFullYear()
    };
});

onMounted(async () => {
    if (route.params.courseId) {
        await fetchCourse(route.params.courseId);
        await fetchCourseActivity()
    }
});

watch(() => route.params.courseId, (newId) => {
    if (newId) {
        fetchCourse(newId);
    }
});

watch(() => course.value, () => {
    document.title = course.value.title
})
</script>

<style scoped lang="scss">
h2 {
    font-weight: 600;
    font-size: 36px;
    line-height: 42px;
    letter-spacing: 1px;
    margin: 15px 0 10px 0;
}

.page__inner {
    margin-bottom: 15px;

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

            .top p {
                flex: 1;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: 1px;
            }

            &.teacher {
                .teacher-name {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                }

            }
        }


        button {
            margin: 10px 0;
            height: 46px;
        }
    }
}


.card:has(.calendar) {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;

    :deep(.vc-nav-container) {

        button:not(.is-active) {
            background-color: transparent;
        }
    }

    :deep(.vc-container) {
        .vc-header {
            align-content: center;

            .vc-base-icon {
                width: 30px;
                height: 30px;
                stroke-width: 1;
                stroke: #292929;
            }

            .vc-title {
                text-transform: capitalize;

                &:hover {
                    opacity: 1 !important;
                }

                span {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    text-align: center;
                }
            }

            button {
                background-color: transparent;
            }
        }

        .vc-weekday {
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0px;
            color: #292929;
            text-transform: capitalize;
        }

        .vc-day {
            // cursor: pointer;
            min-height: 44px;
            padding: 8px;
            border-radius: 4px;

            &.is-not-in-month {
                .day-content {
                    opacity: 0.3;

                    * {
                        opacity: 1;
                    }
                }

            }

            &:hover:not(.is-not-in-month, .is-today) {
                background: #E9F2FF;
            }

            &.is-today {
                background-color: #513DEB;

                * {
                    color: #E9F2FF;
                }
            }
        }

        .day-content {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;


            .day-number {
                display: block;
                font-size: 16px;
            }

            .active-icon {
                top: 4px;
                right: 4px;
                width: 20px;
                height: 20px;
            }
        }

    }
}
</style>