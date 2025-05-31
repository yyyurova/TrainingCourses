import Practicants from '@/pages/courses/teacher/practicants/Practicants.vue'
import PracticantTasks from '@/pages/courses/teacher/practicants/PracticantTasks.vue'

import Courses from '@/pages/courses/Courses.vue'
import Tasks from '@/pages/courses/teacher/Tasks.vue'
import Works from '@/pages/courses/teacher/practicantWork/Works.vue'
import Marks from '@/pages/courses/teacher/marks/Marks.vue'

// export const teacherRoutes = [
//     {
//         path: '/courses',
//         name: 'TeacherCourses',
//         component: Courses,
//         meta: { title: 'Курсы' },
//     },
//     {
//         path: '/courses/:courseId/practicants',
//         name: 'CoursePracticants',
//         component: Practicants,
//         meta: { title: 'Практиканты' },
//     },
//     {
//         path: '/courses/:courseId/practicants/:practicantId',
//         name: 'PracticantTasks',
//         component: PracticantTasks,
//         meta: { title: 'Задания практиканта' },
//     },
//     {
//         path: '/course/tasks',
//         name: 'Tasks',
//         component: Tasks,
//         meta: {
//             title: 'Задания'
//         },
//     },
//     {
//         path: '/course/marks',
//         name: 'Marks',
//         component: Marks,
//         meta: {
//             title: 'Оценки'
//         },
//     },
//     {
//         path: '/course/works/:taskId',
//         name: 'Works',
//         component: Works,
//         meta: {
//             title: 'Работы'
//         },
//     },
// ]  

export const curatorRoutes = [
    {
        path: '/courses',
        name: 'TeacherCourses',
        component: Courses,
        meta: { title: 'Курсы' },
        children: [
            {
                path: ':courseId/practicants',
                name: 'CoursePracticants',
                component: Practicants,
                meta: { title: 'Практиканты' },
            },
            {
                path: ':courseId/practicants/:practicantId',
                name: 'PracticantTasks',
                component: PracticantTasks,
                meta: { title: 'Задания практиканта' },
            },
            {
                path: ':courseId/tasks',
                name: 'Tasks',
                component: Tasks,
                meta: { title: 'Задания' },
            },
            {
                path: ':courseId/marks',
                name: 'Marks',
                component: Marks,
                meta: { title: 'Оценки' },
            },
            {
                path: ':courseId/works/:taskId',
                name: 'Works',
                component: Works,
                meta: { title: 'Работы' },
            },
        ]
    }
]