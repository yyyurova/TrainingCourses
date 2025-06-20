<template>
    <aside class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'active': isActive }">

        <div class="top-row">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="close-sidebar icon" v-if="isMobile" @click="$emit('close')">×</button>
        </div>

        <div class="navigation">
            <template v-for="(section, sectionIndex) in sidebarContent[user.role]" :key="sectionIndex">
                <h1 v-if="section.header">{{ section.header }}</h1>
                <template v-for="(item, itemIndex) in section.items || [section]" :key="itemIndex">
                    <RouterLink v-if="item.linkTo" :to="item.linkTo" class="link" @click="handleCourseClick(item)"
                        :class="{ 'router-link-active': isLinkActive(item) }">
                        <div class="link-content">
                            <img width="24" height="24" :src="item.imageUrl" alt="">
                            <span>{{ item.title }}</span>
                            <img v-if="item.list" class="arrow" :class="{ 'arrow-up': isCoursesListOpen }"
                                src="/icons/arrow.svg" alt="">
                            <!-- <span v-if="item.counter" class="circle">{{ user[item.name] }}</span> -->
                        </div>
                        <div v-if="item.list && courses?.length > 0" class="courses-list"
                            :class="{ 'active': isCoursesListOpen }">

                            <RouterLink v-for="course in courses" :key="course.id" :to="getCourseLink(course)"
                                class="course-link" :class="{
                                    'router-link-active': currentCourseId === course.id.toString(),
                                    'router-link-exact-active': route.path === getCourseLink(course)
                                }">
                                <img v-if="course.photo" class="avatar" :src="course.photo" alt="">
                                <AvatarLetter v-else :name="course.title" />
                                <span class="name">{{ course.title }}</span>
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
            <img v-if="user.image" class="avatar" :src="user.image" alt="User-Avatar">
            <AvatarLetter v-else :name="user.name" />
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

    <Popup v-if="showPopup" :text="popupText" :is-success="isSuccess" @close="closePopup" />

    <ConfirmDelete v-if="showConfirmExit" right-button-text="Выйти" question="Выйти из профиля?"
        text="Вы потеряете доступ к функционалу сервиса." @cancel="closeModal" @confirm="exitFromProfile" />

    <EditUser v-if="showEditModal" @cancel="closeModal" @save="saveUserChanges" />
</template>

<script setup>
import { ref, watch, computed, onMounted, provide, inject, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { resetRoleRoutes } from '@/router';
import { getCurrentUser } from '@/utils/auth';
import { logout } from '@/utils/auth';
import { editProfile } from '@/api/modules/profile';

import ConfirmDelete from './modals/ConfirmDelete.vue';
import EditUser from './modals/EditUser.vue';
import AvatarLetter from './AvatarLetter.vue';
import Popup from './Popup.vue';

const props = defineProps({
    isMobile: Boolean,
    isActive: Boolean,
    onCreateTask: {
        type: Function,
        default: null,
    }
});
const emit = defineEmits(['close']);

const route = useRoute();
const router = useRouter();
const isCoursesListOpen = ref(false);

let courses

const showUserActions = ref(false);
const showConfirmExit = ref(false);
const showEditModal = ref(false);
const user = ref({ role: getCurrentUser().role, name: getCurrentUser().name, image: getCurrentUser().image })
const loadedCourses = ref(false);

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const isCoursesRoute = computed(() => route.path.startsWith('/courses'));

const currentCourseId = computed(() => {
    let matched = route.matched.find(m => m.path.includes(':courseId'));
    return matched ? route.params.courseId : null;
});

const sidebarContent = {
    admin: [
        {
            title: 'Курсы',
            name: 'courses',
            list: true,
            imageUrl: '/icons/graduation.svg',
            linkTo: '/courses'
        },
        {
            title: 'Пользователи',
            name: 'users',
            imageUrl: '/icons/users.svg',
            linkTo: '/users'
        },
        {
            title: 'Учебные классы',
            name: 'classrooms',
            imageUrl: '/icons/book.svg',
            linkTo: '/classrooms',
            activeRoutes: [
                'Classroom',
            ]
        }
    ],
    curator: [
        {
            header: 'Преподавание',
            items: [
                {
                    title: 'Курсы',
                    linkTo: '/courses',
                    name: 'courses',
                    list: true,
                    imageUrl: '/icons/graduation.svg',
                },
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
    user: [
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
                    activeRoutes: [
                        'TaskPage',
                        'TasksCurrent',
                        'TasksOverdue',
                        'TasksDone'
                    ]
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

const closePopup = () => { showPopup.value = false }

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const exitFromProfile = () => {
    logout()
    resetRoleRoutes()
    router.push('/');
};

const closeModal = () => {
    showConfirmExit.value = false;
    showEditModal.value = false;
};

const openConfirmExitModal = () => {
    showConfirmExit.value = true;
};

const openEditModal = () => {
    showEditModal.value = true;
};

const saveUserChanges = async (changes) => {
    try {
        closeModal()
        const resp = await editProfile(changes.name, changes.avatar);

        showMessage('Изменения сохранены', true)

        user.value.name = resp.data.name;
        user.value.avatar = resp.data.avatar
        if (resp.data.image) {
            user.value.image = resp.data.image;
        }

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            name: resp.data.name,
            image: resp.data.image || currentUser.image
        }));

    } catch (error) {
        console.error('Ошибка при сохранении профиля:', error);

        showMessage('Не удалось сохранить изменения', true)
    }
};

const openList = () => {
    isCoursesListOpen.value = !isCoursesListOpen.value;
};

const handleCourseClick = (item) => {
    if (item.list && isCoursesRoute.value) {
        openList();
    }
};

const handleClickOutsideUser = (e) => {
    if (!e.target.closest('.card-user') && !e.target.closest('.user')) {
        showUserActions.value = false;
    }
};

const isLinkActive = (item) => {
    if (item.activeRoutes) {
        return item.activeRoutes.includes(route.name);
    }
    return route.path.startsWith(item.linkTo) ||
        route.name === item.name;
};

const getCourseLink = (course) => {
    const basePath = user.value.role === 'user'
        ? `/courses/${course.id}/my-study`
        : user.value.role === 'curator'
            ? `/courses/${course.id}/practicants`
            : user.value.role === 'admin'
                ? `/course-fill-content/${course.id}`
                : '#';

    return basePath;
}

watch(() => route.path, async (newPath) => {
    if (newPath.startsWith('/courses')) {
        isCoursesListOpen.value = true;
        courses = inject('courses')
    }
}, { immediate: true });

onMounted(() => {
    document.addEventListener('click', handleClickOutsideUser);
});

provide('user', user)
</script>

<style scoped lang="scss">
.sidebar {
    transition: transform 0.3s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 300px;
    padding: 20px 8px;
    background-color: #F8F8F8;
    overflow-x: auto;
    min-height: 100vh;

    &.sidebar-mobile {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        transform: translateX(-100%);
        width: 95%;

        &.active {
            transform: translateX(0);
        }
    }

    .top-row {
        padding-top: 10px;
        padding-right: 20px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        button.close-sidebar {
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
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
                position: relative;
            }
        }

        .courses-list {
            display: flex;
            flex-direction: column;
            gap: 7px;
            padding-left: 40px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 0;

            &.active:not(.sidebar) {
                max-height: 800px;
                // overflow-y: auto;
                opacity: 1;
                margin-top: 10px;
            }

            .avatar {
                width: 35px;
                border-radius: 4px;
                height: 35px;
                object-fit: cover;
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

                &.router-link-active,
                &.router-link-exact-active {
                    background-color: #E9F2FF;
                    font-weight: bold;
                }

                .name {
                    flex: 1;
                }
            }
        }
    }

    .user {
        position: relative;
        display: flex;
        align-items: center;
        gap: 9px;
        margin-left: 20px;
        margin-top: 20px;
        cursor: pointer;

        span {
            word-break: break-all;
        }

        button.icon {
            background: none;
            border: none;
            cursor: pointer;

            &:hover {
                background-color: #E9F2FF;
            }
        }

        img.avatar {
            width: 36px;
            height: auto;
            max-height: 36px;
            border-radius: 4px;
            object-fit: cover;
        }

        .card-user {
            width: 200px;
            border: 1px solid #D9D9D9;
            background-color: #FFFFFF;
            border-radius: 8px;
            position: absolute;
            bottom: calc(100% + 10px);
            left: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;

            .list {
                list-style-type: none;
                padding: 10px;
                margin: 0;

                .element {
                    padding: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: #f5f5f5;
                    }

                    .label {
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 20px;

                        &.exit {
                            color: #ff4444;
                        }
                    }
                }
            }
        }
    }
}
</style>