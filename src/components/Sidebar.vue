<template>
    <aside class="sidebar">
        <div class="top-row">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="close-sidebar icon" v-if="isMobile" @click="$emit('close')">×</button>
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
                                :to="mockUser.role === 'student' ? `/courses/${course.id}/my-study` : '/classrooms'"
                                class="course-link">
                                <img class="avatar" :src="course.imageUrl" alt="">
                                <span class="name">{{ course.name }}</span>
                            </RouterLink>
                        </div>
                    </RouterLink>
                    <button v-else class="link transparent"
                        @click="item.name === 'createTask' ? onCreateTask?.() : null">
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
        <div class="user" @click="showUserActions = !showUserActions">
            <img class="avatar" :src="user.avatar" alt="User-Avatar">
            <span>{{ user.name }}</span>
            <button class="icon">
                <img src="/icons/menu-vertical.svg" alt="">
            </button>
            <div class="card-user" v-if="showUserActions">
                <ul class="list">
                    <li class="element" @click="openEditModal">
                        <p class="label">Редактировать</p>
                    </li>
                    <li class="element" @click="openConfirmExitModal">
                        <p class="label exit">Выйти</p>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
    <ConfirmDelete v-if="showConfirmExit" right-button-text="Выйти" question="Выйти из профиля?"
        text="Вы потеряете доступ к функционалу сервиса." @cancel="closeModal" @confirm="exitFromProfile" />
    <EditUser v-if="showEditModal" @cancel="closeModal" @save="saveUserChanges" />
</template>

<script setup>
import { mockUser } from '@/mocks/user';
import axios from 'axios';
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ConfirmDelete from './modals/ConfirmDelete.vue';
import EditUser from './modals/EditUser.vue';

defineProps({
    isMobile: Boolean,
    onCreateTask: {
        type: Function,
        default: null,
    },
})

defineEmits(['close'])

const route = useRoute();
const router = useRouter()
const isCoursesListOpen = ref(false);
const courses = ref([]);

const showUserActions = ref(false)
const showConfirmExit = ref(false)
const showEditModal = ref(false)

const user = ref(mockUser)

const isCoursesRoute = computed(() => route.path.startsWith('/courses'));

const exitFromProfile = () => {
    router.push('/')
}

const closeModal = () => {
    if (showConfirmExit.value) { showConfirmExit.value = false }
    if (showEditModal.value) { showEditModal.value = false }
}

const openConfirmExitModal = () => {
    showConfirmExit.value = true
}

const openEditModal = () => {
    showEditModal.value = true
}

const saveUserChanges = (changes) => {
    if (changes.name) {
        user.value.name = changes.name
    }
    if (changes.avatar) {
        user.value.avatar = changes.avatar
    }
}

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

const openList = () => {
    isCoursesListOpen.value = !isCoursesListOpen.value;
};

const handleCourseClick = (item) => {
    if (item.list && isCoursesRoute.value) {
        openList();
    }
};

const handleClickOutsideUser = (e) => {
    if (showUserActions.value) {
        if (!e.target.closest('.card-user') && !e.target.closest('.user ')) {
            showUserActions.value = false
        }
    }
}

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
                    linkTo: '/course/practicants'
                },
                {
                    title: 'Создать задание',
                    name: 'createTask',
                    imageUrl: '/icons/plus-black.svg',
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

onMounted(() => {
    document.addEventListener('click', handleClickOutsideUser)
})
</script>

<style scoped lang="scss">
.sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 300px;
    padding: 20px 8px;
    background-color: #F8F8F8;
    overflow-x: auto;

    .top-row {
        padding-top: 10px;
        padding-right: 20px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        button.close-sidebar {
            font-size: 24px;
        }

        .logo {
            padding: 0 20px;

            img {
                width: 68px;
                height: 78px;
            }
        }

    }

    h1 {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1px;
        padding: 10px;
    }

    .navigation {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 10px;

        .link {
            width: 100%;

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
                width: 100%;
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
        position: relative;
        display: flex;
        align-items: center;
        gap: 5px;
        margin-left: 20px;
        margin-top: 20px;
        cursor: pointer;

        button.icon {
            margin-left: 3px;
            padding: 3px;

            &:hover {
                background-color: #E9F2FF;
            }
        }

        img.avatar {
            width: 36px;
            height: auto;
            border-radius: 4px;
        }

        .card-user {
            width: 200px;
            border: 1px solid #D9D9D9;
            background-color: #FFFFFF;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            position: absolute;
            z-index: 1000;
            position: absolute;
            bottom: calc(100% + 10px);
            left: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

            .list {
                list-style-type: none;
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 0px 10px;

                .element {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #141414;
                    transition: all 0.3s ease-out;
                    border-radius: 6px;
                    cursor: pointer;
                    padding: 10px;

                    .label {
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 20px;
                        letter-spacing: 0px;
                    }

                }
            }
        }
    }
}

@media (max-width: 930px) {
    .sidebar {
        width: 95% !important;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        z-index: 1001;

        .close-sidebar {
            display: block;
        }

        .logo {
            padding-top: 20px;
        }
    }
}
</style>