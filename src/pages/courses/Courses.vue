<template>
    <component :is="component"></component>
</template>

<script setup>
import { getUserRole } from '@/utils/auth';
import { ref, provide, onMounted } from 'vue';
import { getCourses as getStudentCourses } from '@/api/modules/courses.api';
import { getCourses as getAdminCourses } from '@/api/modules/adminCourses.api';
import { getCourses as getCuratorCourses } from '@/api/modules/curatorCourses.api';

import Admin_courses from './admin/Admin_courses.vue';
import Student_courses from './student/Student_courses.vue';
import Teacher_courses from './teacher/Teacher_courses.vue';

let component;
const courses = ref([])
const isLoading = ref(false)

const user_role = getUserRole()

switch (user_role) {
    case 'admin':
        component = Admin_courses
        break
    case 'user':
        component = Student_courses
        break
    case 'curator':
        component = Teacher_courses
        break
}

const getCoursesByRole = async () => {
    if (user_role === 'admin') {
        try {
            isLoading.value = true
            courses.value = await getAdminCourses()
        } finally {
            isLoading.value = false
        }
    }
    else if (user_role === 'user') {
        try {
            isLoading.value = true
            courses.value = await getStudentCourses()
        }
        finally {
            isLoading.value = false
        }
    }
    else if (user_role === 'curator') {
        try {
            isLoading.value = true
            courses.value = await getCuratorCourses()
        }
        finally {
            isLoading.value = false
        }
    }
}

provide('courses', courses)
provide('isLoading', isLoading)

onMounted(getCoursesByRole)
</script>