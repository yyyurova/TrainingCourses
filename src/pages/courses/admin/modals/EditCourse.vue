<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Редактировать курс</h2>
                <div class="form-group">
                    <Card class="no-hover">
                        <img :src="courseImagePreview || '/image.png'" alt="Course image">
                        <div class="modal-buttons">
                            <button class="transparent" type="button" @click="triggerFileInput">Загрузить</button>
                            <button class="transparent" type="button" @click="removeImage">Удалить</button>
                            <input ref="fileInput" type="file" accept="image/*" style="display: none;"
                                @change="handleFileUpload">
                        </div>
                    </Card>
                </div>
                <div class="form-group">
                    <label>Название<span class="required">*</span></label>
                    <input v-model="courseName" type="text" autocomplete="off" required :class="{ 'error': nameError }">
                </div>
                <div class="modal-buttons">
                    <button class="transparent" @click="cancel">Отмена</button>
                    <button class="blue" @click="save">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Card from '@/components/Card.vue';

const emit = defineEmits(['cancel', 'edit']);

const props = defineProps({
    course: {
        type: Object,
        required: true
    }
});


const courseName = ref(props.course.title);
const courseImageBase64 = ref(null);
const courseImagePreview = ref(props.course.photo);
const fileInput = ref(null);
const nameError = ref(false);

watch(() => props.course, (newVal) => {
    courseName.value = newVal.title;
    courseImagePreview.value = newVal.phoyo;
    courseImageBase64.value = null;
    if (fileInput.value) fileInput.value.value = '';
}, { immediate: true });

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        courseImageBase64.value = e.target.result;
        courseImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    courseImageBase64.value = null;
    courseImagePreview.value = '/avatar.png';
    if (fileInput.value) fileInput.value.value = '';
};

const cancel = () => {
    emit('cancel');
};

const save = () => {
    if (!courseName.value.trim()) {
        nameError.value = true;
        return;
    }

    const courseData = {
        id: props.course.id,
        title: courseName.value,
        photo: courseImageBase64.value || courseImagePreview.value
    };
    emit('edit', courseData);
};
</script>

<style scoped lang="scss">
.card {
    width: 100%;

    img {
        width: 100%;
        height: auto;
        max-height: 200px;
        object-fit: cover;
    }

    button {
        border: 1px solid #513DEB;
    }
}

.form-group {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
}
</style>