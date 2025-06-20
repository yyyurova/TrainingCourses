<template>
    <aside v-if="course" class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'active': isActive }">
        <div class="top-row">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="close-sidebar icon" v-if="isMobile" @click="$emit('close')">×</button>
        </div>

        <div class="course-info">
            <img v-if="course.photo" :src="course.photo" alt="">
            <AvatarLetter v-else :name="course.title" />
            <p class="course-name">{{ course.title }}</p>
        </div>

        <button :title="course.published === 1 ? 'Курс уже опубликован' : ''" :disabled="course.published === 1"
            class="blue wide" @click="publishCourse">Опубликовать курс</button>

        <RouterLink to="/courses">
            <button class="transparent wide">
                <img class="arrow-left" src="/icons/arrow.svg" alt="">
                Вернуться к списку курсов</button>
        </RouterLink>

        <div class="navigation">
            <RouterLink class="link" :to="`/course-fill-content/${course.id}`">
                Содержание курса
            </RouterLink>

            <div class="link" @click="goToFillCourse">
                Заполнить учебные материалы для курса
            </div>
        </div>

        <div class="user" @click="showUserActions = !showUserActions">
            <img v-if="user.avatar" class="avatar" :src="user.avatar" alt="User-Avatar">

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
    <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :is-success="isSuccess" />

    <ConfirmDelete v-if="showConfirmExit" right-button-text="Выйти" question="Выйти из профиля?"
        text="Вы потеряете доступ к функционалу сервиса." @cancel="closeModal" @confirm="exitFromProfile" />

    <EditUser v-if="showEditModal" @cancel="closeModal" @save="saveUserChanges" />
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { getCurrentUser } from '@/utils/auth';
import { useRouter } from 'vue-router';
import { logout } from '@/utils/auth';
import { resetRoleRoutes } from '@/router';
import { editProfile } from '@/api/modules/profile.api';
import { pulichCourse } from '@/api/modules/adminCourses.api';

import EditUser from '@/components/modals/EditUser.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';
import Popup from '@/components/Popup.vue';

const showUserActions = ref(false);
const showConfirmExit = ref(false);
const showEditModal = ref(false);
const user = ref(getCurrentUser());

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const course = inject('course')
const content = inject('content')

const router = useRouter()

const props = defineProps({
    isMobile: Boolean,
    isActive: Boolean,
});

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const publishCourse = async () => {
    try {
        closeModal();
        await pulichCourse(course.value.id, { title: course.value.title, published: true })
        router.push('/courses')

        showMessage('Курс успешно опубликован', true)
    } catch {
        showMessage('Не удалось опубликовать курс', false)
    }
}

const emit = defineEmits(['close']);

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
    if (changes.name) {
        user.value.name = changes.name;
        const resp = await editProfile(changes.name)
        localStorage.removeItem('user')
        localStorage.setItem('user', JSON.stringify({
            id: resp.data.id,
            name: resp.data.name,
            role: resp.data.role,
        }));

    }
    if (changes.avatar) user.value.avatar = changes.avatar;
};

const handleClickOutsideUser = (e) => {
    if (!e.target.closest('.card-user') && !e.target.closest('.user')) {
        showUserActions.value = false;
    }
};

const goToFillCourse = () => {
    if (!content.value?.modules || content.value.modules.length === 0) {
        return;
    }

    for (const module of content.value.modules) {
        if (!module.pages || module.pages.length === 0) {
            module.noPages = true;
            return;
        }
    }
    router.push(`/course-fill-materials/${course.value.id}/module/${content.value.modules[0].id}/page/${content.value.modules[0].pages[0].id}`);
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
            height: 40px;
            border-radius: 4px;
            object-fit: cover;
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

        &:disabled {
            background-color: #EBEBEB;
            color: #969696;
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
            cursor: pointer;
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

        span {
            word-break: break-all;
        }

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

@media (max-width: 1280px) {
    .sidebar {
        min-width: 300px;
        width: 300px;
    }
}
</style>