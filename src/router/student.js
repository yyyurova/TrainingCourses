import CourseMainPage from "@/pages/courses/student/CourseMainPage.vue"
import CourseTasksPage from "@/pages/courses/student/CourseTasksPage.vue"
import CoursePerfomancePage from "@/pages/courses/student/CoursePerformancePage.vue"
import Courses from "@/pages/courses/Courses.vue"
import TaskPage from "@/pages/courses/student/taskPage/TaskPage.vue"

import CourseCompletion from "@/pages/courseCompletion/CourseCompletion.vue"

import StudentTasksAll from "@/pages/tasks/student/StudentTasksAll.vue"
import StudentTasksOverdue from "@/pages/tasks/student/StudentTasksOverdue.vue"
import StudentTasksDone from "@/pages/tasks/student/StudentTasksDone.vue"
import Chat from "@/pages/chat/Chat.vue"
import Members from "@/pages/chat/components/open/settings/components/members/Members.vue"
import Docs from "@/pages/chat/components/open/settings/components/Docs.vue"
import Attachments from "@/pages/chat/components/open/settings/components/attachments/Attachments.vue"

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
                path: ':id/my-study',
                name: 'CourseMain',
                component: CourseMainPage,
                meta: {
                    title: 'Курс'
                }
            },
            {
                path: ':id/performance',
                name: 'CoursePerfomance',
                component: CoursePerfomancePage,
                meta: {
                    title: 'Курс'
                }
            },
            {
                path: ':id/tasks',
                name: 'CourseTasks',
                component: CourseTasksPage,
                meta: {
                    title: 'Курс'
                },
            },
            {
                path: ':id/tasks/:taskId',
                name: 'TaskPage',
                component: TaskPage,
                meta: {
                    title: 'Задание'
                }
            }
        ]
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
    },
    {
        path: '/courseCompletion/:courseId',
        name: 'CourseCompletion',
        component: CourseCompletion,
        meta: {
            title: 'Прохождение курса'
        }
    }
]