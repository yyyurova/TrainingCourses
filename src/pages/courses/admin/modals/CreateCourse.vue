<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Создать курс</h2>

                <div class="form-group">
                    <Card class="no-hover">
                        <img :src="courseImagePreview" alt="Course image" id="course-image">

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
                    <button class="blue" @click="create">Создать</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from '@/components/Card.vue';

const emit = defineEmits(['cancel', 'create']);

const courseName = ref('');
const courseImageFile = ref(null);
const courseImagePreview = ref('/icons/avatar.png');
const fileInput = ref(null);
const nameError = ref(false);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    courseImageFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        courseImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    courseImageFile.value = null;
    courseImagePreview.value = '/icons/avatar.png';
    if (fileInput.value) fileInput.value.value = '';
};

const cancel = () => {
    removeImage();
    courseName.value = '';
    emit('cancel');
};

const create = () => {
    if (!courseName.value.trim()) {
        nameError.value = true;
        return;
    }

    const courseData = {
        title: courseName.value,
        photo: courseImageFile.value,
    };

    emit('create', courseData);
    cancel();
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