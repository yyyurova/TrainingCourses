import CourseMainPage from "@/pages/courses/student/CourseMainPage.vue"
import CourseTasksPage from "@/pages/courses/student/CourseTasksPage.vue"
import CoursePerfomancePage from "@/pages/courses/student/CoursePerformancePage.vue"
import Courses from "@/pages/courses/Courses.vue"
import TaskPage from "@/pages/courses/student/taskPage/TaskPage.vue"

import CourseCompletion from "@/pages/courseCompletion/CourseCompletion.vue"

import StudentTasksAll from "@/pages/tasks/student/StudentTasksAll.vue"
import StudentTasksOverdue from "@/pages/tasks/student/StudentTasksOverdue.vue"
import StudentTasksDone from "@/pages/tasks/student/StudentTasksDone.vue"


export const studentRoutes = [
    {
        path: '/courses',
        name: 'Courses',
        component: Courses,
        meta: {
            title: 'Курсы'
        },
        children: [
            {
                path: ':courseId/my-study',
                name: 'CourseMain',
                component: () => import('@/pages/courses/student/CourseMainPage.vue'),
                meta: {
                    title: 'Курс'
                }
            },
            {
                path: ':courseId/performance',
                name: 'CoursePerfomance',
                component: () => import('@/pages/courses/student/CoursePerformancePage.vue'),
                meta: {
                    title: 'Курс'
                }
            },
            {
                path: ':courseId/tasks',
                name: 'CourseTasks',
                component: () => import('@/pages/courses/student/CourseTasksPage.vue'),
                meta: {
                    title: 'Курс'
                },
            },
        ]
    },
    {
        path: '/tasks/:taskId',
        name: 'TaskPage',
        component: () => import('@/pages/courses/student/taskPage/TaskPage.vue'),
        meta: {
            title: 'Задание'
        }
    },
    {
        path: '/tasks/current',
        name: 'TasksCurrent',
        component: () => import('@/pages/tasks/student/StudentTasksAll.vue'),
        meta: {
            title: 'Текущие задания'
        }
    },
    {
        path: '/tasks/overdue',
        name: 'TasksOverdue',
        component: () => import('@/pages/tasks/student/StudentTasksOverdue.vue'),
        meta: {
            title: 'Просроченные задания'
        }
    },
    {
        path: '/tasks/done',
        name: 'TasksDone',
        component: () => import('@/pages/tasks/student/StudentTasksDone.vue'),
        meta: {
            title: 'Выполненные задания'
        }
    },
    {
        path: '/courseCompletion/:courseId',
        name: 'CourseCompletion',
        component: () => import('@/pages/courseCompletion/CourseCompletion.vue'),
        meta: {
            title: 'Прохождение курса'
        },
        children: [
            {
                path: 'module/:moduleId/page/:pageId',
                name: 'CourseCompletionPage',
                component: () => import('@/pages/courseCompletion/CourseCompletion.vue'),
                meta: {
                    title: 'Прохождение курса'
                }
            }
        ]
    }
]