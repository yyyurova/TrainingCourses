import Users from '../pages/users/Users.vue'
import Classrooms from '@/pages/classrooms/Classrooms.vue'
import Classroom from '@/pages/classrooms/classroom/Classroom.vue'
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
        name: 'Classrooms',
        component: Classrooms,
        meta: {
            title: 'Учебные классы'
        },
    },
    {
        path: '/classrooms/:classId',
        component: Classroom,
        name: 'Classroom'
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
                path: 'module/:moduleId',
                name: 'CourseModule',
                component: FillMaterials,
                children: [
                    {
                        path: 'page/:pageId',
                        name: 'CoursePage',
                        component: FillMaterials,
                        meta: { title: 'Шаг обучения' }
                    }
                ]
            }
        ]
    }
]  