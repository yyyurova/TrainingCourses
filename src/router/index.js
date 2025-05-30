import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./admin";
import { studentRoutes } from "./student";
import { curatorRoutes } from "./curator";
import { getUserRole } from "@/utils/auth";

import Registration from "@/pages/auth/Registration.vue";
import Login from "@/pages/auth/Login.vue";
import EmailVerification from "@/pages/auth/EmailVerification.vue";
import Chat from "@/pages/chat/Chat.vue";

import Attachments from "@/pages/chat/components/open/settings/components/attachments/Attachments.vue";
import Docs from "@/pages/chat/components/open/settings/components/Docs.vue";
import Members from "@/pages/chat/components/open/settings/components/members/Members.vue";

const baseRoutes = [
    {
        path: '/',
        name: 'Authorization',
        component: Login,
        meta: {
            title: 'Вход',
            requiresAuth: false // Явно помечаем публичные маршруты
        }
    },
    {
        path: '/signup',
        name: 'Registration',
        component: Registration,
        meta: {
            title: 'Регистрация',
            requiresAuth: false
        },
    },
    {
        path: '/verification',
        name: 'EmailVerification',
        component: EmailVerification,
        meta: {
            title: 'Подтверждение электронной почты',
            requiresAuth: false
        }
    },
];

const chatRoute = {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: {
        title: 'Чат',
        requiresAuth: true // Требует авторизации
    },
    children: [
        {
            path: ':chatId',
            name: 'ChatDialog',
            component: Chat,
            props: true,
            children: [
                {
                    path: 'members',
                    name: 'Members',
                    component: Members,
                },
                {
                    path: 'docs',
                    name: 'Documents',
                    component: Docs,
                },
                {
                    path: 'attachments',
                    name: 'Attachments',
                    component: Attachments,
                }
            ]
        }
    ]
}

export const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes
});

// Соответствие ролей и маршрутов
const roleRoutesMap = {
    admin: [...adminRoutes],
    user: [...studentRoutes, chatRoute],
    curator: [...curatorRoutes, chatRoute]
};

export function addRoleRoutes(role) {
    resetRoleRoutes();
    const routes = roleRoutesMap[role] || [];
    routes.forEach(route => router.addRoute(route));
}

export function initRouter() {
    const token = localStorage.getItem('token');
    const role = getUserRole()

    if (role && token) {
        addRoleRoutes(role);
        return true;
    }
    return false;
}

// Главная навигационная охрана
router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');
    const role = getUserRole();

    // Установка заголовка страницы
    document.title = to.meta?.title || 'Training Courses';

    // Для публичных маршрутов всегда разрешаем доступ
    if (to.meta.requiresAuth === false) {
        return next();
    }

    // Если маршрут требует авторизации
    if (!token) {
        // Перенаправляем на логин если нет токена
        return next('/');
    }

    // Если роль еще не добавлена в роутер
    if (role && !router.hasRoute(to.name)) {
        addRoleRoutes(role);
        return next(to.fullPath); // Повторяем навигацию
    }

    next();
});

export function resetRoleRoutes() {
    router.getRoutes().forEach(route => {
        if (!baseRoutes.some(r => r.name === route.name)) {
            router.removeRoute(route.name);
        }
    });
}

// В конец routes после добавления всех маршрутов
router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/notFound/NotFound.vue')
});