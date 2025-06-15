<template>
    <Card class="my-tasks no-hover">
        <h2>Мои задания</h2>
        <div v-if="uploadedFiles.length > 0" class="uploaded-files">
            <Card class="no-hover" v-for="(file, index) in uploadedFiles" :key="index">
                <img src="/icons/file.svg" alt="">
                <div class="file__inner">
                    <a href="#" @click.prevent="downloadFile(file)">{{ file.name }}</a>
                    <p>{{ formatDate(new Date()) }} ({{ formatFileSize(file.size) }})</p>
                </div>
                <button class="icon" @click="removeFile(index)">
                    <img src="/icons/x.svg">
                </button>
            </Card>
        </div>

        <div v-if="enteredLinks.length > 0" class="links">
            <Card class="no-hover" v-for="(link, index) in enteredLinks" :key="index">
                <img src="/icons/link.svg">
                <div class="link__inner">
                    <a target="_blank" :href="link">{{ link }}</a>
                </div>
                <button @click="removeLink(index)" class="icon">
                    <img src="/icons/x.svg">
                </button>
            </Card>
        </div>
        <button class="add" @click="openChoicePopup">Добавить +
            <FileOrLinkPopup v-if="showChoicePopup" @file="() => emit('openFileModal')"
                @link="$emit('openLinkModal')" />
        </button>

        <button @click="passToCheck"
            :class="uploadedFiles.length === 0 && enteredLinks.length === 0 ? 'unable' : 'blue'">Сдать
            на
            проверку</button>
    </Card>
    <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :isSuccess="isSuccess" />
</template>

<script setup>
import { inject, ref } from 'vue';
import { sendTask } from '@/api/modules/tasks.api';

import Card from '@/components/Card.vue';
import FileOrLinkPopup from '../../modals/FileOrLinkPopup.vue';
import Popup from '@/components/Popup.vue';
import { getUserId } from '@/utils/auth';

const emit = defineEmits(['openLinkModal', 'openFileModal',])

const enteredLinks = inject('enteredLinks')
const uploadedFiles = inject('uploadedFiles')

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const task = inject('task')

const userId = getUserId()

const showChoicePopup = inject('showChoicePopup')
const openChoicePopup = () => {
    showChoicePopup.value = true
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const removeFile = (index) => {
    uploadedFiles.value.splice(index, 1);
};

const removeLink = (index) => {
    enteredLinks.value.splice(index, 1)
}

const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// MyTasks.vue
const passToCheck = async () => {
    try {
        if (uploadedFiles.value.length === 0 && enteredLinks.value.length === 0) {
            popupText.value = 'Добавьте файл или ссылку для отправки';
            showPopup.value = true;
            isSuccess.value = false;
            setTimeout(() => showPopup.value = false, 5000);
            return;
        }

        // Проверка на количество файлов/ссылок
        if (uploadedFiles.value.length > 1 || enteredLinks.value.length > 1) {
            popupText.value = 'Можно отправить только один файл или одну ссылку';
            showPopup.value = true;
            isSuccess.value = false;
            setTimeout(() => showPopup.value = false, 5000);
            return;
        }

        // Отправляем на сервер
        await sendTask(
            task.value.id,
            userId,
            uploadedFiles.value || null,
            enteredLinks.value || null
        );

        // Очищаем после успешной отправки
        uploadedFiles.value = [];
        enteredLinks.value = [];

        popupText.value = 'Задание успешно отправлено на проверку.';
        showPopup.value = true;
        isSuccess.value = true;

        setTimeout(() => {
            showPopup.value = false;
        }, 5000);

    } catch (error) {
        console.error('Ошибка отправки:', error);
        popupText.value = 'Ошибка при отправке задания: ' +
            (error.response?.data?.message || 'Попробуйте позже');
        showPopup.value = true;
        isSuccess.value = false;

        setTimeout(() => {
            showPopup.value = false;
        }, 5000);
    }
};
const closePopup = () => {
    showPopup.value = false
}
</script>

<style scoped lang="scss">
.my-tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 100%;
    overflow: hidden;

    .links {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .card {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;

            .link__inner {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
        }
    }

    .uploaded-files {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .card {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;

            .file__inner {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;

                p {
                    color: #787878;
                }
            }
        }
    }

    button:not(.icon) {
        width: 100%;

        &.add {
            position: relative;
            background-color: #E9F2FF;

            .popup {
                left: 0;
                top: 0;
            }
        }

        &.unable {
            color: #969696;
            background-color: #EBEBEB;
        }
    }
}
</style>