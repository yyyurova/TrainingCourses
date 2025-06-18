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
                    <input :value="classroomCourse?.title || ''" @blur="handleCourseBlur($event)"
                        @focus="showCoursesDropdown = true; handleDropdownPosition($event)" type="text"
                        placeholder="Начните вводить название курса">
                    <div v-show="showCoursesDropdown" class="dropdown courses">
                        <div v-for="course in courses" :key="course.id" class="item"
                            @mousedown="classroomCourse = course">
                            <img :src="course.imageUrl || 'image.png'" :alt="course.title">
                            <span>{{ course.title }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="transparent" @click="cancel">Отмена</button>
                    <button class="blue" @click="next">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { getCourses } from '@/api/modules/adminCourses.api';

const emit = defineEmits(['cancel', 'next']);

const classroomName = ref('');
const classroomCourse = ref(null)

const showCoursesDropdown = ref(false)

const courses = ref([])

const cancel = () => {
    classroomName.value = '';
    classroomCourse.value = null
    emit('cancel');
};

const next = () => {
    if (!classroomName.value || !classroomCourse.value) {
        // Можно добавить обработку ошибки
        return;
    }

    emit('next', {
        title: classroomName.value,
        course_id: classroomCourse.value.id
    });
};

const fetchCourses = async () => {
    courses.value = await getCourses()
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