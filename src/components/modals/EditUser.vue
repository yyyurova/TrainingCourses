<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Редактировать профиль</h2>
                <div class="form-group">
                    <Card class="avatar no-hover">
                        <img :src="avatarPreview" alt="User avatar">
                        <div class="modal-buttons">
                            <button type="button" class="transparent" @click="triggerFileInput">Загрузить</button>
                            <button type="button" class="transparent" @click="removeImage">Удалить</button>
                            <input ref="fileInput" type="file" accept="image/*" style="display: none;"
                                @change="handleFileUpload">
                        </div>
                    </Card>
                </div>

                <div class="form-group">
                    <label>Имя и Фамилия <span class="required">*</span></label>
                    <input v-model="userName" type="text" autocomplete="off" required :class="{ 'error': nameError }">
                </div>

                <div class="modal-buttons">
                    <button type="button" class="transparent" @click="cancel">Отмена</button>
                    <button type="button" class="blue" @click="save">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue';

import Card from '../Card.vue';

const emit = defineEmits(['cancel', 'save'])

const user = inject('user')
const userName = ref(user.value.name);
const avatarBase64 = ref(null);
const avatarPreview = ref(user.value.image || '/avatar.png');
const fileInput = ref(null);
const nameError = ref(false);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert('Пожалуйста, выберите изображение');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('Изображение должно быть меньше 2MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    avatarBase64.value = null;
    avatarPreview.value = '/avatar.png';
    if (fileInput.value) fileInput.value.value = '';
};

const cancel = () => {
    removeImage();
    userName.value = user.value.name;
    emit('cancel');
};

const save = () => {
    if (!userName.value.trim()) {
        nameError.value = true;
        return;
    }

    const userData = {
        name: userName.value.trim(),
        avatar: fileInput.value?.files[0] || null
    };

    emit('save', userData);
};
</script>

<style scoped lang="scss">
.card.avatar {
    width: 100%;
    margin-bottom: 10px;

    img {
        width: 100%;
        height: auto;
    }

    .modal-buttons {
        button {
            border: 1px solid #513DEB;
        }
    }
}

input {
    width: 100%;
}

p {
    margin-bottom: 7px;
}
</style>