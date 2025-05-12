import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./admin";
import { studentRoutes } from "./student";
import { mockUser } from "@/mocks/user";

import Registration from "@/pages/auth/Registration.vue";
import Login from "@/pages/auth/Login.vue";
import EmailVerification from "@/pages/auth/EmailVerification.vue";

const baseRoutes = [{
    path: '/',
    name: 'Authorization',
    component: Login,
    meta: {
        title: 'Вход'
    }
},
{
    path: '/signup',
    name: 'Registration',
    component: Registration,
    meta: {
        title: 'Регистрация'
    },
},
{
    path: '/verification',
    name: 'EmailVerification',
    component: EmailVerification,
    meta: {
        title: 'Подтверждение электронной почты'
    }
}

];

function getRoleRoutes() {
    if (mockUser.role === 'admin') {
        return [...adminRoutes];
    }
    if (mockUser.role === 'student') {
        return [...studentRoutes];
    }
    return [];
}

export const router = createRouter({
    history: createWebHistory(),
    routes: [...baseRoutes, ...getRoleRoutes()]
});

router.afterEach((to) => {
    document.title = to.meta?.title || 'Training Courses';
});