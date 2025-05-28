import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./admin";
import { studentRoutes } from "./student";
import { teacherRoutes } from "./teacher";

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

const chatRoute = {
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

export const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes
});

export function addRoleRoutes(role) {
    resetRoleRoutes(); // Сначала очищаем старые маршруты

    let routes = [];

    switch (role) {
        case 'admin':
            routes = [...adminRoutes];
            break;
        case 'user':
            routes = [...studentRoutes, chatRoute];
            break;
        case 'curator':
            routes = [...teacherRoutes, chatRoute];
            break;
    }

    routes.forEach(route => {
        router.addRoute(route);
    });
}

export function initRouter() {
    console.log(localStorage.getItem('user_role'))
    const role = localStorage.getItem('user_role');
    if (role) addRoleRoutes(role);
}

router.afterEach((to) => {
    document.title = to.meta?.title || 'Training Courses';
});


export function resetRoleRoutes() {
    router.getRoutes().forEach(route => {
        if (!baseRoutes.some(r => r.name === route.name)) {
            router.removeRoute(route.name);
        }
    });
}

// function getRoleRoutes() {
//     if (user_role === 'admin') {
//         return [...adminRoutes];
//     }
//     if (user_role === 'user') {
//         return [...studentRoutes,
//         {
//             path: '/chat',
//             name: 'Chat',
//             component: Chat,
//             meta: {
//                 title: 'Чат'
//             },
//             children: [
//                 {
//                     path: ':chatId',
//                     name: 'ChatDialog',
//                     component: Chat,
//                     props: true,
//                     children: [
//                         {
//                             path: 'members',
//                             name: 'Members',
//                             component: Members,
//                         },
//                         {
//                             path: 'docs',
//                             name: 'Documents',
//                             component: Docs,
//                         },
//                         {
//                             path: 'attachments',
//                             name: 'Attachments',
//                             component: Attachments,
//                         }
//                     ]
//                 }
//             ]
//         }
//         ];
//     }
//     if (user_role === 'teacher') {
//         return [...teacherRoutes, {
//             path: '/chat',
//             name: 'Chat',
//             component: Chat,
//             meta: {
//                 title: 'Чат'
//             },
//             children: [
//                 {
//                     path: ':chatId',
//                     name: 'ChatDialog',
//                     component: Chat,
//                     props: true,
//                     children: [
//                         {
//                             path: 'members',
//                             name: 'Members',
//                             component: Members,
//                         },
//                         {
//                             path: 'docs',
//                             name: 'Documents',
//                             component: Docs,
//                         },
//                         {
//                             path: 'attachments',
//                             name: 'Attachments',
//                             component: Attachments,
//                         }
//                     ]
//                 }
//             ]
//         },]
//     }
//     return [];
// }

// export const router = createRouter({
//     history: createWebHistory(),
//     routes: [...baseRoutes, ...getRoleRoutes()]
// });

// router.afterEach((to) => {
//     document.title = to.meta?.title || 'Training Courses';
// });