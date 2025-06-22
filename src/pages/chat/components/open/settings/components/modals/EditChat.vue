<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Изменение группы</h2>

                <Card v-if="!file" class="no-hover">
                    <img class="avatar" :src="getAvatarUrl(selectedChat.avatar)" alt="">
                    <input type="file" accept="image/*" style="display: none;">
                    <p class="limit-message" v-if="limitMessage">{{ limitMessage }}</p>
                    <button class="transparent border" @click="fileUpload">
                        <span>Загрузить</span>
                        <img src="/icons/actions/paperclip.svg" alt="">
                    </button>
                </Card>

                <Card v-if="file" class="no-hover">
                    <img :src="file.preview" alt="Загруженное изображение" style="max-width: 100%; max-height: 200px;">
                    <button class="transparent border" @click="deleteImage">Удалить</button>
                </Card>

                <p>Название группы<span class="required">*</span></p>

                <input ref="nameInput" type="text" autocomplete="off" placeholder="Введите название" v-model="title">

                <div class="modal-buttons">
                    <button class="transparent border" @click="$emit('cancel')">Отмена</button>
                    <button class="blue" @click="save" :disabled="isLoading">
                        {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, inject } from 'vue';

import Card from '@/components/Card.vue';

const emit = defineEmits(['cancel']);

const selectedChat = inject('selectedChat');
const editChat = inject('editChat');

const file = ref(null);
const nameInput = ref(null);
const isLoading = ref(false);

const limitMessage = ref('')

const title = ref(selectedChat.value.title);

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

const save = async () => {
    if (limitMessage.value !== '') { return }
    const titleValue = title.value.trim();
    if (!titleValue) {
        nameInput.value.style.border = '1px solid red';
        return;
    }

    try {
        isLoading.value = true;
        await editChat({
            title: titleValue,
            isGroup: true,
            avatar: file.value?.file || null
        });
        emit('cancel');
    } finally {
        isLoading.value = false;
    }
};

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/icons/avatar.png';
    return `https://api-course.hellishworld.ru${avatarPath}`;
}

const fileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.jfif)$/i;
            if (!allowedExtensions.exec(selectedFile.name)) {
                limitMessage.value = 'Недопустимое расширение файла'
                return;
            } else { limitMessage.value = '' }

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
        }

        .avatar {
            width: 100%;
        }

        .limit-message {
            color: red;
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