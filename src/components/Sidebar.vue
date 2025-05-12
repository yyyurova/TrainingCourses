<template>
    <aside class="sidebar">
        <div class="logo">
            <img src="/icons/logo.svg" alt="Logo">
        </div>
        <div class="navigation">
            <template v-for="(section, sectionIndex) in sidebarContent[mockUser.role]" :key="sectionIndex">
                <h1 v-if="section.header">{{ section.header }}</h1>
                <template v-for="(item, itemIndex) in section.items || [section]" :key="itemIndex">
                    <RouterLink v-if="item.linkTo" :to="item.linkTo" class="link" @click="handleCourseClick(item)">
                        <div class="link-content">
                            <img width="24" height="24" :src="item.imageUrl" alt="">
                            <span>{{ item.title }}</span>
                            <img v-if="item.list" class="arrow" :class="{ 'arrow-up': isCoursesListOpen }"
                                src="/icons/arrow.svg" alt="">
                            <span v-if="item.counter" class="circle">{{ mockUser[item.name] }}</span>
                        </div>
                        <div v-if="item.list" class="courses-list" :class="{ 'active': isCoursesListOpen }">
                            <RouterLink v-for="course in courses" :key="course.id"
                                :to="`/courses/${course.id}/my-study`" class="course-link">
                                <img class="avatar" :src="course.imageUrl" alt="">
                                <span class="name">{{ course.name }}</span>
                            </RouterLink>
                        </div>
                    </RouterLink>
                    <button v-else class="link" @click="handleCourseClick(item)">
                        <div class="link-content">
                            <img width="24" height="24" :src="item.imageUrl" alt="">
                            <span>{{ item.title }}</span>
                            <img v-if="item.list" class="arrow" :class="{ 'arrow-up': isCoursesListOpen }"
                                src="/icons/arrow.svg" alt="">
                        </div>
                    </button>
                </template>
            </template>
        </div>
        <div class="user">
            <img class="avatar" :src="mockUser.avatar" alt="User-Avatar">
            <span>{{ mockUser.name }}</span>
            <img src="/icons/menu-vertical.svg" alt="">
        </div>
    </aside>
</template>

<script setup>
import { mockUser } from '@/mocks/user';
import axios from 'axios';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isCoursesListOpen = ref(false);
const courses = ref([]);

const isCoursesRoute = computed(() => route.path.startsWith('/courses'));

const fetchCourses = async () => {
    try {
        const params = { sortBy: '-id' };
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses`, { params });
        courses.value = data.map(obj => ({ ...obj }));
    } catch (err) {
        console.log(err);
    }
};

const loadedCourses = ref(false);

watch(() => route.path, async (newPath) => {
    if (newPath.startsWith('/courses')) {
        if (newPath.startsWith('/courses/'))
            isCoursesListOpen.value = true

        if (!loadedCourses.value) {
            await fetchCourses();
            loadedCourses.value = true;
        }
    }
}, { immediate: true });

const openList = () => {
    isCoursesListOpen.value = !isCoursesListOpen.value;
};

const handleCourseClick = (item) => {
    if (item.list && isCoursesRoute.value) {
        openList();
    }
};

const sidebarContent = {
    admin: [
        {
            title: 'Пользователи',
            name: 'users',
            imageUrl: '/icons/users.svg',
            linkTo: '/users'
        },
        {
            title: 'Курсы',
            name: 'courses',
            list: true,
            imageUrl: '/icons/graduation.svg',
            linkTo: '/courses'
        },
        {
            title: 'Учебные классы',
            name: 'classrooms',
            imageUrl: '/icons/book.svg',
            linkTo: '/classrooms'
        }
    ],
    teacher: [
        {
            header: 'Преподавание',
            items: [
                {
                    title: 'Курс',
                    name: 'course',
                    imageUrl: '/icons/graduation.svg',
                    linkTo: '/courses'
                },
                {
                    title: 'Создать задание',
                    name: 'createTask',
                    imageUrl: '/icons/plus.svg',
                }
            ]
        },
        {
            header: 'Общение',
            items: [
                {
                    title: 'Чат',
                    name: 'chat',
                    imageUrl: '/icons/chat.svg',
                    linkTo: '/chat',
                    counter: true,
                }
            ]
        }
    ],
    student: [
        {
            header: 'Обучение',
            items: [
                {
                    title: 'Курсы',
                    name: 'courses',
                    imageUrl: '/icons/graduation.svg',
                    linkTo: '/courses',
                    list: true
                },
                {
                    title: 'Задания',
                    name: 'tasks',
                    imageUrl: '/icons/task.svg',
                    linkTo: '/tasks/current',
                    counter: true,
                }
            ]
        },
        {
            header: 'Общение',
            items: [
                {
                    title: 'Чат',
                    name: 'chat',
                    imageUrl: '/icons/chat.svg',
                    linkTo: '/chat',
                    counter: true,
                }
            ]
        }
    ]
};
</script>

<style scoped lang="scss">
.sidebar {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 300px;
    padding: 20px 8px;
    background-color: #F8F8F8;

    h1 {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1px;
        padding: 10px;
    }

    .logo {
        padding: 0 20px;

        img {
            width: 68px;
            height: 78px;
        }
    }

    .navigation {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 10px;

        .link {
            text-decoration: none;
            padding: 5px;

            .arrow {
                transition: transform 0.3s;

                &.arrow-up {
                    transform: rotate(180deg);
                }
            }

            &.router-link-active div:not(.courses-list, .courses-list div) {
                background-color: #E9F2FF;
                border-radius: 8px;
            }

            .link-content {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px 20px;

            }
        }

        .courses-list {
            display: flex;
            flex-direction: column;
            gap: 7px;
            padding-left: 40px;
            max-height: 0;
            overflow: auto;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 0;

            &.active {
                max-height: 500px;
                opacity: 1;
                margin-top: 10px;
            }

            .avatar {
                width: 24px;
                height: 24px;
            }

            .course-link {
                display: flex;
                gap: 10px;
                align-items: center;
                padding: 5px 10px;
                border-radius: 8px;
                text-decoration: none;

                &:hover {
                    background-color: #E9F2FF;
                }
            }

            .router-link-active {
                background-color: #E9F2FF;
                font-weight: bold;
            }
        }
    }

    .user {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-left: 20px;
        margin-top: 20px;
        cursor: pointer;

        img.avatar {
            width: 36px;
            height: auto;
            border-radius: 4px;
        }
    }
}
</style>