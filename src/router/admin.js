import Users from '../pages/users/Users.vue'
import Classrooms from '@/pages/classrooms/Classrooms.vue'
import Courses from '@/pages/courses/Courses.vue'
import FillContent from '@/pages/courses/admin/createdCourse/fillContent/FillContent.vue'
import FillMaterials from '@/pages/courses/admin/createdCourse/fillMaterials/FillMaterials.vue'

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
    },
    {
        path: '/course-fill-content/:courseId',
        name: 'FillContent',
        component: FillContent,
        meta: {
            title: 'Содержание курса'
        },
    },
    {
        path: '/course-fill-materials/:courseId',
        name: 'FillMaterials',
        component: FillMaterials,
        meta: {
            title: 'Материалы курса'
        },
        children: [
            {
                path: ':chapterId',
                name: 'CourseChapter',
                component: FillMaterials,
                children: [
                    {
                        path: ':stepId',
                        name: 'CourseStep',
                        component: FillMaterials,
                        meta: { title: 'Шаг обучения' }
                    }
                ]
            }
        ]
    }
]  