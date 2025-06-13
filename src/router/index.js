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
    component: () => import('@/pages/chat/Chat.vue'),
    meta: {
        title: 'Чат',
        requiresAuth: true
    },
    children: [
        {
            path: ':chatId',
            name: 'ChatDialog',
            component: () => import('@/pages/chat/Chat.vue'),
            props: true,
            children: [
                {
                    path: 'members',
                    name: 'Members',
                    component: () => import('@/pages/chat/components/open/settings/components/members/Members.vue'),
                },
                {
                    path: 'docs',
                    name: 'Documents',
                    component: () => import('@/pages/chat/components/open/settings/components/Docs.vue'),
                },
                {
                    path: 'attachments',
                    name: 'Attachments',
                    component: () => import('@/pages/chat/components/open/settings/components/attachments/Attachments.vue'),
                }
            ]
        }
    ]
}

export const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes
});

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

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token');
    const role = getUserRole();

    document.title = to.meta?.title || 'Training Courses';

    if (to.meta.requiresAuth === false) {
        return next();
    }

    if (!token) {
        return next('/');
    }

    if (role && !router.hasRoute(to.name)) {
        addRoleRoutes(role);
        return next(to.fullPath);
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

router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/notFound/NotFound.vue')
});