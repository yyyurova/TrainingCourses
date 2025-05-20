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
import { ref } from 'vue';

import { mockUser } from '@/mocks/user';
import Card from '../Card.vue';

const emit = defineEmits(['cancel', 'save'])

const userName = ref(mockUser.name);
const avatarBase64 = ref(null);
const avatarPreview = ref(mockUser.avatar || '/avatar.png');
const fileInput = ref(null);
const nameError = ref(false);

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        avatarBase64.value = e.target.result;
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
    userName.value = mockUser.name;
    emit('cancel');
};

const save = () => {
    if (!userName.value.trim()) {
        nameError.value = true;
        return;
    }

    const userData = {
        name: userName.value,
        avatar: avatarBase64.value || '/image.png',
    };

    emit('save', userData);
    emit('cancel')
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