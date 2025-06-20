import Courses from '@/pages/courses/Courses.vue'

export const adminRoutes = [
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
        component: () => import('@/pages/courses/admin/createdCourse/fillContent/FillContent.vue'),
        meta: {
            title: 'Содержание курса'
        },
    },
    {
        path: '/course-fill-materials/:courseId',
        name: 'FillMaterials',
        component: () => import('@/pages/courses/admin/createdCourse/fillMaterials/FillMaterials.vue'),
        meta: {
            title: 'Материалы курса'
        },
        children: [
            {
                path: 'module/:moduleId',
                name: 'CourseModule',
                component: () => import('@/pages/courses/admin/createdCourse/fillMaterials/FillMaterials.vue'),
                children: [
                    {
                        path: 'page/:pageId',
                        name: 'CoursePage',
                        component: () => import('@/pages/courses/admin/createdCourse/fillMaterials/FillMaterials.vue'),
                        meta: { title: 'Шаг обучения' }
                    }
                ]
            }
        ]
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('@/pages/users/Users.vue'),
        meta: {
            title: 'Пользователи'
        },
    },
    {
        path: '/classrooms',
        name: 'Classrooms',
        component: () => import('@/pages/classrooms/Classrooms.vue'),
        meta: {
            title: 'Учебные классы'
        },
    },
    {
        path: '/classrooms/:classId',
        component: () => import('@/pages/classrooms/classroom/Classroom.vue'),
        name: 'Classroom'
    },
]  