import Users from '../pages/users/Users.vue'
import Classrooms from '@/pages/classrooms/Classrooms.vue'

export const adminRoutes = [
    {
        path: '/',
        name: 'users',
        component: Users,
        meta: {
            title: 'Пользователи'
        },
    },
    {
        path: '/classrooms',
        name: 'classrooms',
        component: Classrooms,
        meta: {
            title: 'Учебные классы'
        },
    }
]  