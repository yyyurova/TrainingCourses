import Users from '../pages/users/Users.vue'
import Classrooms from '@/pages/classrooms/Classrooms.vue'
import Courses from '@/pages/courses/Courses.vue'

export const adminRoutes = [
    {
        path: '/users',
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
    },
    {
        path: '/courses',
        name: 'Courses',
        component: Courses,
        meta: {
            title: 'Курсы'
        },
    }
]  