import Practicants from '@/pages/teacherCourse/practicants/Practicants.vue'
import PracticantTasks from '@/pages/teacherCourse/practicants/PracticantTasks.vue'

import Tasks from '@/pages/teacherCourse/Tasks.vue'
import Marks from '@/pages/teacherCourse/marks/Marks.vue'

import Works from '@/pages/teacherCourse/practicantWork/Works.vue'

export const teacherRoutes = [
    {
        path: '/course/practicants',
        name: 'Practicants',
        component: Practicants,
        meta: {
            title: 'Практиканты'
        },
    },
    {
        path: '/course/practicants/:practicantId',
        name: 'PracticantTasks',
        component: PracticantTasks,
        meta: {
            title: 'Задания практиканта'
        },
    },
    {
        path: '/course/tasks',
        name: 'Tasks',
        component: Tasks,
        meta: {
            title: 'Задания'
        },
    },
    {
        path: '/course/marks',
        name: 'Marks',
        component: Marks,
        meta: {
            title: 'Оценки'
        },
    },
    {
        path: '/course/works/:taskId',
        name: 'Works',
        component: Works,
        meta: {
            title: 'Работы'
        },
    },
]  