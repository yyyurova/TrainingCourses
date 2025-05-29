<template>
    <component :is="component"></component>
</template>

<script setup>
import Admin_courses from './admin/Admin_courses.vue';
import Student_courses from './student/Student_courses.vue';

let component;
const user_role = localStorage.getItem('user_role')
switch (user_role) {
    case 'admin':
        component = Admin_courses
        break
    case 'user':
        component = Student_courses
        break
}
</script>