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
                component: CourseMainPage,
                meta: {
                    title: 'Курс'
                }
            },
            {
                path: ':courseId/performance',
                name: 'CoursePerfomance',
                component: CoursePerfomancePage,
                meta: {
                    title: 'Курс'
                }
            },
            {
                path: ':courseId/tasks',
                name: 'CourseTasks',
                component: CourseTasksPage,
                meta: {
                    title: 'Курс'
                },
            },
        ]
    },
    {
        path: '/tasks/:taskId',
        name: 'TaskPage',
        component: TaskPage,
        meta: {
            title: 'Задание'
        }
    },
    {
        path: '/tasks/current',
        name: 'TasksCurrent',
        component: StudentTasksAll,
        meta: {
            title: 'Текущие задания'
        }
    },
    {
        path: '/tasks/overdue',
        name: 'TasksOverdue',
        component: StudentTasksOverdue,
        meta: {
            title: 'Просроченные задания'
        }
    },
    {
        path: '/tasks/done',
        name: 'TasksDone',
        component: StudentTasksDone,
        meta: {
            title: 'Выполненные задания'
        }
    },
    {
        path: '/courseCompletion/:courseId',
        name: 'CourseCompletion',
        component: CourseCompletion,
        meta: {
            title: 'Прохождение курса'
        }
    },
    {
        path: '/courseCompletion/:courseId/:moduleIndex?/:pageIndex?',
        name: 'CourseCompletion',
        component: CourseCompletion,
        meta: {
            title: 'Прохождение курса'
        }
    }
]