import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./admin";
import { studentRoutes } from "./student";
import { teacherRoutes } from "./teacher";
import { mockUser } from "@/mocks/user";

import Registration from "@/pages/auth/Registration.vue";
import Login from "@/pages/auth/Login.vue";
import EmailVerification from "@/pages/auth/EmailVerification.vue";

import Chat from "@/pages/chat/Chat.vue";
import Attachments from "@/pages/chat/components/open/settings/components/attachments/Attachments.vue";
import Docs from "@/pages/chat/components/open/settings/components/Docs.vue";
import Members from "@/pages/chat/components/open/settings/components/members/Members.vue";

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
},


];

function getRoleRoutes() {
    if (mockUser.role === 'admin') {
        return [...adminRoutes];
    }
    if (mockUser.role === 'student') {
        return [...studentRoutes,
        {
            path: '/chat',
            name: 'Chat',
            component: Chat,
            meta: {
                title: 'Чат'
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
        ];
    }
    if (mockUser.role === 'teacher') {
        return [...teacherRoutes, {
            path: '/chat',
            name: 'Chat',
            component: Chat,
            meta: {
                title: 'Чат'
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
        },]
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