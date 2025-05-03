<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Создать учебный класс</h2>
                <div class="form-group">
                    <label>Название<span class="required">*</span></label>
                    <input v-model="classroomName" type="text" autocomplete="off" required>
                </div>

                <div class="form-group">
                    <p>Курс<span class="required">*</span></p>
                    <input :value="classroomCourse !== null ? classroomCourse.name : ''"
                        @blur="handleCourseBlur($event)"
                        @focus="showCoursesDropdown = true; handleDropdownPosition($event)" type="text"
                        placeholder="Начните вводить название курса">
                    <div v-show="showCoursesDropdown" class="dropdown courses">
                        <div v-for="course in courses" :key="course.id" class="item"
                            @mousedown="classroomCourse = course">
                            <img :src="course.imageUrl" :alt="course.name">
                            <span>{{ course.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <p>Участники<span class="required">*</span></p>
                    <input :value="classroomMembers.map(member => member.name).join(', ')"
                        @blur="handleUserBlur($event)" @focus="showUsersDropdown = true; handleDropdownPosition($event)"
                        @input="handleInput" type="text" placeholder="Начните вводить имя или фамилию">
                    <div v-show="showUsersDropdown" class="dropdown">
                        <div v-for="user in users" :key="user.id" class="item" @mousedown.prevent>
                            <input type="checkbox" :value="user" v-model="classroomMembers">
                            <img src="/icons/Avatar.svg" :alt="user.name">
                            <span>{{ user.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="transparent" @click="cancel">Отмена</button>
                    <button class="blue" @click="create">Создать</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';

const emit = defineEmits(['cancel', 'create']);

const classroomName = ref('');
const classroomMembers = ref([])
const classroomCourse = ref(null)

const showUsersDropdown = ref(false)
const showCoursesDropdown = ref(false)

const users = ref([])

const courses = ref([])

const cancel = () => {
    classroomName.value = '';
    classroomCourse.value = null
    classroomMembers.value = []
    emit('cancel');
};

const create = () => {
    const classroomData = {
        name: classroomName.value,
        course: classroomCourse.value,
        members: classroomMembers.value,
    };

    emit('create', classroomData);
    cancel();
};

const fetchUsers = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users`);

        users.value = data.map(obj => ({
            ...obj
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const fetchCourses = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses`);

        courses.value = data.map(obj => ({
            ...obj
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const handleDropdownPosition = (event) => {
    const input = event.target
    const dropdown = input.nextElementSibling
    if (!dropdown) return

    const rect = input.getBoundingClientRect()
    dropdown.style.top = `${rect.bottom + window.scrollY}px`
    dropdown.style.left = `${rect.left + window.scrollX}px`
    dropdown.style.minWidth = `${rect.width}px`
}

const handleUserBlur = (event) => {
    setTimeout(() => {
        showUsersDropdown.value = false;
        const input = event.target
        const dropdown = input.nextElementSibling
        if (!dropdown) return

        // const rect = input.getBoundingClientRect()
        dropdown.style.top = `0px`
        dropdown.style.left = `0px`
    }, 100);
};

const handleCourseBlur = (event) => {
    setTimeout(() => {
        showCoursesDropdown.value = false;
        const input = event.target
        const dropdown = input.nextElementSibling
        if (!dropdown) return

        // const rect = input.getBoundingClientRect()
        dropdown.style.top = `0px`
        dropdown.style.left = `0px`
    }, 100);

};

onMounted(async () => {
    await fetchUsers()
    await fetchCourses()
})
</script>
<style scoped lang="scss">
.form-group {
    position: static;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 7px;

    .dropdown {
        border-radius: 0 0 5px 5px;
        max-height: 150px;
        background-color: #fff;
        position: fixed;
        z-index: 10001;
        width: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        margin-top: 0;

        &.courses .item {
            cursor: pointer;
        }
    }
}
</style>