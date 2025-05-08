import CourseMainPage from "@/pages/courses/student/CourseMainPage.vue"
import CourseTasksPage from "@/pages/courses/student/CourseTasksPage.vue"
import CoursePerfomancePage from "@/pages/courses/student/CoursePerformancePage.vue"
import Courses from "@/pages/courses/Courses.vue"
import TaskPage from "@/pages/courses/student/taskPage/TaskPage.vue"

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
    }
]