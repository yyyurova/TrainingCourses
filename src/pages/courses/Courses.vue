<template>
    <component :is="component"></component>
</template>

<script setup>
import { getUserRole } from '@/utils/auth';
import { ref, provide, onMounted } from 'vue';
import { getCourses } from '@/api/modules/courses.api';
import { getCourses as getAdminCourses } from '@/api/modules/adminCourses.api';

import Admin_courses from './admin/Admin_courses.vue';
import Student_courses from './student/Student_courses.vue';
import Teacher_courses from './teacher/Teacher_courses.vue';

let component;
const courses = ref([])

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
        courses.value = await getAdminCourses()
    }
    else {
        courses.value = await getCourses()
    }
}

provide('courses', courses)

onMounted(getCoursesByRole)
</script>