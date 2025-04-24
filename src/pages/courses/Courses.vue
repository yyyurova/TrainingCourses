<template>
    <component :is="component"></component>
</template>

<script setup>
import { mockUser } from '@/mocks/user';
import Admin_courses from './Admin_courses.vue';
import Student_courses from './Student_courses.vue';

let component;
switch (mockUser.role) {
    case 'admin':
        component = Admin_courses
        break
    case 'student':
        component = Student_courses
        break
}
</script>