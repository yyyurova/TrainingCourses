<template>
    <aside v-if="course" class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'active': isActive }">
        <div class="top-row">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="close-sidebar icon" v-if="isMobile" @click="$emit('close')">×</button>
        </div>

        <div class="course-info">
            <img :src="course.imageUrl || '/avatar.png'" alt="">
            <p class="course-name">{{ course.title }}</p>
        </div>

        <button class="blue wide">Опубликовать курс</button>
        <RouterLink to="/courses">
            <button class="transparent wide">
                <img class="arrow-left" src="/icons/arrow.svg" alt="">
                Вернуться к списку курсов</button>
        </RouterLink>
        <div class="navigation">
            <RouterLink class="link" :to="`/course-fill-content/${course.id}`">
                Содержание курса
            </RouterLink>
            <RouterLink class="link" :to="`/course-fill-materials/${course.id}`">
                Заполнить учебные материалы для курса
            </RouterLink>
        </div>
        <div class="user" @click="showUserActions = !showUserActions">
            <img class="avatar" :src="user.avatar || '/image.png'" alt="User-Avatar">
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
import { ref, onMounted, inject } from 'vue';
import { mockUser } from '@/mocks/user';

import EditUser from '@/components/modals/EditUser.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';

const showUserActions = ref(false);
const showConfirmExit = ref(false);
const showEditModal = ref(false);
const user = ref({ name: localStorage.getItem('user_name'), role: localStorage.getItem('user_role') });

const course = inject('course')

const props = defineProps({
    isMobile: Boolean,
    isActive: Boolean,
});

const emit = defineEmits(['close']);

const exitFromProfile = () => {
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

const saveUserChanges = (changes) => {
    if (changes.name) user.value.name = changes.name;
    if (changes.avatar) user.value.avatar = changes.avatar;
};

const handleClickOutsideUser = (e) => {
    if (!e.target.closest('.card-user') && !e.target.closest('.user')) {
        showUserActions.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutsideUser);
});
</script>

<style scoped lang="scss">
.sidebar {
    transition: transform 0.3s ease;
    position: relative;
    display: flex;
    gap: 10px;
    flex-direction: column;
    min-width: 360px;
    width: 360px;
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

    .course-info {
        display: flex;
        gap: 10px;
        align-items: center;

        img {
            width: 40px;
            height: auto;
        }

        .course-name {
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
            word-break: break-all;
        }
    }

    a {
        text-decoration: none;
    }

    button.wide {
        height: 46px;
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
            padding: 8px 20px;

            .arrow {
                transition: transform 0.3s;

                &.arrow-up {
                    transform: rotate(180deg);
                }
            }

            &.router-link-active {
                background-color: #E9F2FF;
                border-radius: 8px;
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
            background: none;
            border: none;
            cursor: pointer;

            &:hover {
                background-color: #E9F2FF;
            }
        }

        img.avatar {
            width: 36px;
            height: 36px;
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

@media (max-width: 1280px) {
    .sidebar {
        min-width: 300px;
        width: 300px;
    }
}
</style>