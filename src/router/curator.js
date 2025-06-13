import Practicants from '@/pages/courses/teacher/practicants/Practicants.vue'
import PracticantTasks from '@/pages/courses/teacher/practicants/PracticantTasks.vue'

import Courses from '@/pages/courses/Courses.vue'
import Tasks from '@/pages/courses/teacher/Tasks.vue'
import Works from '@/pages/courses/teacher/practicantWork/Works.vue'
import Marks from '@/pages/courses/teacher/marks/Marks.vue'
import CourseContent from '@/pages/courses/teacher/courseContent/CourseContent.vue'

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
                component: () => import('@/pages/courses/teacher/practicants/Practicants.vue'),
                meta: { title: 'Практиканты' },
            },
            {
                path: ':courseId/practicants/:practicantId',
                name: 'PracticantTasks',
                component: () => import('@/pages/courses/teacher/practicants/PracticantTasks.vue'),
                meta: { title: 'Задания практиканта' },
            },
            {
                path: ':courseId/tasks',
                name: 'Tasks',
                component: () => import('@/pages/courses/teacher/Tasks.vue'),
                meta: { title: 'Задания' },
            },
            {
                path: ':courseId/marks',
                name: 'Marks',
                component: () => import('@/pages/courses/teacher/marks/Marks.vue'),
                meta: { title: 'Оценки' },
            },
            {
                path: ':courseId/content',
                name: 'Content',
                component: () => import('@/pages/courses/teacher/courseContent/CourseContent.vue'),
                meta: { title: 'Содержание курса' },
            },
            {
                path: ':courseId/works/:taskId',
                name: 'Works',
                component: () => import('@/pages/courses/teacher/practicantWork/Works.vue'),
                meta: { title: 'Работы' },
            },
        ]
    }
]