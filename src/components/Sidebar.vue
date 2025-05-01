<template>
    <aside class="sidebar">
        <div class="logo">
            <img src="/icons/logo.svg" alt="Logo">
        </div>
        <div class="navigation">
            <RouterLink :to="item.linkTo" v-for="(item, index) in sidebarContent[mockUser.role]" :key="index"
                class="link">
                <div class="link-content" @click="item.list ? openList() : ''">
                    <img width="24" height="24" :src="item.imageUrl" alt="">
                    <span>{{ item.name }}</span>
                    <img v-if="item.list" class="arrow-up" src="/icons/arrow.svg" alt="">
                </div>
                <div v-if="item.list" class="courses-list" :class="{ 'active': isCoursesListOpen }">
                    <div v-for="course in courses" :key="course.id">
                        <img class="avatar" :src="course.imageUrl" alt="">
                        <span class="name">{{ course.name }}</span>
                    </div>
                </div>
            </RouterLink>
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
import { inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isCoursesListOpen = ref(false);
let courses;

watch(() => route.path, (newPath) => {
    if (newPath.startsWith('/courses')) {
        courses = inject('courses');
    }
}, { immediate: true })

const openList = () => {
    isCoursesListOpen.value = !isCoursesListOpen.value;
    const arrow = document.querySelector('.arrow-up');
    if (arrow) {
        arrow.classList.toggle('arrow-down');
        // arrow.classList.toggle('arrow-up');
    }
};

const sidebarContent = {
    admin: [
        {
            name: 'Пользователи',
            imageUrl: '/icons/users.svg',
            linkTo: '/'
        },
        {
            name: 'Курсы',
            list: true,
            imageUrl: '/icons/graduation.svg',
            linkTo: '/courses'
        },
        {
            name: 'Учебные классы',
            imageUrl: '/icons/book.svg',
            linkTo: '/classrooms'
        }
    ],
    teacher: [
        {
            name: 'Курс',
            imageUrl: '/icons/graduation.svg',
            linkTo: '/courses'
        },
        {
            name: 'Создать задание',
            imageUrl: '/icons/plus.svg',
            linkTo: ''
        }
    ],
    student: [
        {
            name: 'Курсы',
            imageUrl: '/icons/graduation.svg',
            linkTo: 'courses'
        },
        {
            name: 'Задания',
            imageUrl: '/icons/task.svg',
            linkTo: '/tasks'
        },
        {
            name: 'Уведомления',
            imageUrl: '/icons/notifications.svg',
            linkTo: '/notifications'
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

            div {
                display: flex;
                gap: 10px;
                align-items: center;
                padding: 5px 10px;
                border-radius: 8px;

                &:hover {
                    background-color: #E9F2FF;
                }
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