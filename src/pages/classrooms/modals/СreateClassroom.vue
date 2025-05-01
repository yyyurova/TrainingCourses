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
                    <input @blur="showCoursesDropdown = false" @focus="showCoursesDropdown = true" @input="handleInput"
                        type="text" placeholder="Начните вводить название курса">
                    <div v-show="showCoursesDropdown" class="dropdown courses">
                        <div v-for="course in courses" :key="course.id" class="item">
                            <img :src="course.imageUrl" :alt="course.name">
                            <span>{{ course.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <p>Участники<span class="required">*</span></p>
                    <input @blur="showUsersDropdown = false" @focus="showUsersDropdown = true" @input="handleInput"
                        type="text" placeholder="Начните вводить имя или фамилию">
                    <div v-show="showUsersDropdown" class="dropdown">
                        <div v-for="user in users" :key="user.id" class="item">
                            <input type="checkbox">
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
import { onMounted, ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['cancel', 'create']);

const classroomName = ref('');
const classroomMembers = ref([])
const classroomCourse = ref(null)

const showUsersDropdown = ref(true)
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

onMounted(async () => {
    await fetchUsers()
    await fetchCourses()
})
</script>
<style scoped lang="scss">
.form-group {
    position: relative;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 7px;

    .dropdown {
        background-color: #fff;
        z-index: 10000;
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;

        &.courses .item {
            cursor: pointer;
        }
    }
}
</style>