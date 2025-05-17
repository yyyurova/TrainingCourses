<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Создание группы</h2>
                <Card v-if="!file" class="no-hover">
                    <img src="/icons/image.svg" alt="">
                    <label>Загрузить фотографию</label>
                    <input type="file" accept="image/*" style="display: none;">
                    <button class="transparent" @click="fileUpload">
                        <span>Загрузить</span>
                        <img src="/icons/paperclip.svg" alt="">
                    </button>
                </Card>
                <Card v-if="file" class="no-hover">
                    <img :src="file.preview" alt="Загруженное изображение" style="max-width: 100%; max-height: 200px;">
                    <button class="transparent" @click="deleteImage">Удалить</button>
                </Card>
                <p>Название группы<span class="required">*</span></p>
                <input ref="nameInput" type="text" autocomplete="off" placeholder="Введите название">

                <div class="modal-buttons">
                    <button class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button class="blue" @click="next">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

import Card from '@/components/Card.vue';

const emit = defineEmits(['cancel', 'next']);

const file = ref(null);
const nameInput = ref(null);
const isLoading = ref(false);

onBeforeUnmount(() => {
    if (file.value?.preview) {
        URL.revokeObjectURL(file.value.preview);
    }
});

const deleteImage = () => {
    if (file.value?.preview) {
        URL.revokeObjectURL(file.value.preview);
    }
    file.value = null;
};

const uploadImage = async (fileToUpload) => {
    try {
        const formData = new FormData();
        formData.append('file', fileToUpload);

        const response = await fetch('https://c1a9f09250b13f61.mokky.dev/uploads', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Ошибка загрузки изображения');
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        throw error;
    }
};

const next = async () => {
    if (nameInput.value.value.trim() === '') {
        nameInput.value.style = 'border: 1px solid red';
        return;
    }

    isLoading.value = true;

    try {
        let imageUrl = null;

        if (file.value?.file) {
            const uploadedImage = await uploadImage(file.value.file);
            imageUrl = uploadedImage.url;

            URL.revokeObjectURL(file.value.preview);
        }

        localStorage.setItem('groupImage', imageUrl || '');
        localStorage.setItem('groupName', nameInput.value.value);

        emit('next');
        nameInput.value.value = '';
        file.value = null;
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        isLoading.value = false;
    }
};

const fileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (file.value?.preview) {
                URL.revokeObjectURL(file.value.preview);
            }

            file.value = {
                file: selectedFile,
                preview: URL.createObjectURL(selectedFile)
            };
        }
    };

    fileInput.click();
};
</script>

<style scoped lang="scss">
.modal__inner {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .card {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 20px;

        button.transparent {
            height: 43px;
            width: 200px;
            border: 1px solid #513DEB;
        }
    }

    input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #D9D9D9;
        border-radius: 8px;
    }
}
</style>