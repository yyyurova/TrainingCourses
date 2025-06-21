<template>
    <Card class="my-tasks no-hover">
        <h2>Мои задания</h2>

        <div v-if="userAttachments.length > 0" class="uploaded-files">
            <Card class="no-hover" v-for="attachment in userAttachments" :key="attachment.id">
                <img :src="attachment.type === 'link' ? '/icons/link.svg' : '/icons/file.svg'" alt="">
                <div class="file__inner">
                    <a :href="attachment.url" target="_blank" rel="noopener noreferrer">
                        {{ attachment.name || attachment.url }}
                    </a>
                    <p v-if="attachment.size">{{ formatFileSize(attachment.size) }}</p>
                </div>
                <button v-if="isEditing" class="icon" @click="deleteAttachment(attachment.id)">
                    <img src="/icons/x.svg">
                </button>
            </Card>
        </div>

        <div v-if="uploadedFiles.length > 0" class="uploaded-files">
            <Card class="no-hover" v-for="(file, index) in uploadedFiles" :key="'new-file-' + index">
                <img src="/icons/file.svg" alt="">
                <div class="file__inner">
                    <a href="#" @click.prevent="downloadFile(file)">{{ file.name }}</a>
                    <p>{{ formatFileSize(file.size) }}</p>
                </div>
                <button class="icon" @click="removeFile(index)">
                    <img src="/icons/x.svg">
                </button>
            </Card>
        </div>

        <div v-if="enteredLinks.length > 0" class="links">
            <Card class="no-hover" v-for="(link, index) in enteredLinks" :key="'new-link-' + index">
                <img src="/icons/link.svg">
                <div class="link__inner">
                    <a target="_blank" :href="link">{{ link }}</a>
                </div>
                <button @click="removeLink(index)" class="icon">
                    <img src="/icons/x.svg">
                </button>
            </Card>
        </div>

        <div class="action-buttons">
            <button v-if="!isSubmitted" class="add" @click="openChoicePopup">
                Добавить +
                <FileOrLinkPopup v-if="showChoicePopup" @file="() => emit('openFileModal')"
                    @link="$emit('openLinkModal')" />
            </button>

            <!-- Если задание не сдано — кнопка "Сдать на проверку" -->
            <button v-if="!isSubmitted" @click="passToCheck"
                :class="(uploadedFiles?.length === 0 && enteredLinks.length === 0) ? 'unable' : 'blue'">
                Сдать на проверку
            </button>

            <!-- Если задание уже сдано — показываем "Отменить отправку" или "Сохранить изменения" -->
            <template v-if="isSubmitted">
                <button v-if="!isEditing" @click="startEditing" class="transparent border">
                    Отменить отправку
                </button>
                <button v-else @click="updateSubmission" class="blue">
                    Сохранить изменения
                </button>
            </template>
        </div>

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :isSuccess="isSuccess" />
    </Card>
</template>

<script setup>
import { inject, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { sendTask, updateTask, deleteAttachment as apiDeleteAttachment } from '@/api/modules/tasks';
import { getUserId } from '@/utils/auth';

import Card from '@/components/Card.vue';
import FileOrLinkPopup from '../../modals/FileOrLinkPopup.vue';
import Popup from '@/components/Popup.vue';

const emit = defineEmits(['openLinkModal', 'openFileModal']);

const route = useRoute();
const task = inject('task');
const fetchTask = inject('fetchTask');
const uploadedFiles = inject('uploadedFiles');
const enteredLinks = inject('enteredLinks');
const showChoicePopup = inject('showChoicePopup');

const showPopup = ref(false);
const popupText = ref('');
const isSuccess = ref(true);
const isEditing = ref(false);

// Находим текущего студента и его вложения
const currentStudent = computed(() => {
    const userId = getUserId();
    return task.value?.students?.find(s => s.id == userId) || null;
});

const userAttachments = computed(() => {
    return currentStudent.value?.files || [];
});

const isSubmitted = computed(() => {
    return userAttachments.value.length > 0;
});

// Форматирование данных
const formatFileSize = (sizeInMB) => {
    const sizeInKB = sizeInMB * 1024;
    if (sizeInMB < 0.1) {
        return `${sizeInKB.toFixed(2)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
};

// Управление вложениями
const removeFile = (index) => {
    uploadedFiles.value.splice(index, 1);
};

const removeLink = (index) => {
    enteredLinks.value.splice(index, 1);
};

const openChoicePopup = () => {
    showChoicePopup.value = true;
};

const passToCheck = async () => {
    try {
        if (uploadedFiles.value.length === 0 && enteredLinks.value.length === 0) {
            showMessage('Добавьте файл или ссылку для отправки', false);
            return;
        }

        await sendTask(
            task.value.id,
            getUserId(),
            uploadedFiles.value.length > 0 ? uploadedFiles.value : null,
            enteredLinks.value.length > 0 ? enteredLinks.value : null
        );

        uploadedFiles.value = [];
        enteredLinks.value = [];
        await fetchTask(route.params.taskId);
        showMessage('Задание успешно отправлено на проверку', true);
    } catch (error) {
        showMessage('Ошибка при отправке задания', false);
    }
};

const deleteAttachment = async (attachmentId) => {
    try {
        await apiDeleteAttachment(attachmentId);
        await fetchTask(route.params.taskId);

        // Если вложений не осталось, задание считается "не сданным"
        if (userAttachments.value.length === 0) {
            isSubmitted.value = false;
            isEditing.value = false; // Выходим из режима редактирования
        }

        showMessage('Вложение успешно удалено', true);
    } catch (error) {
        showMessage('Ошибка при удалении вложения', false);
    }
};

const updateSubmission = async () => {
    try {

        // uploadedFiles.value = [];
        // enteredLinks.value = [];
        isEditing.value = false;

        // Проверяем, есть ли ещё вложения
        if (userAttachments.value.length === 0) {
            isSubmitted.value = false; // Если вложений нет — задание "не сдано"
        }

        showMessage('Изменения успешно сохранены', true);
    } catch (error) {
        showMessage('Ошибка при сохранении изменений', false);
    }
};

// Управление режимами редактирования
const startEditing = () => {
    isEditing.value = true;
};

// Вспомогательные функции
const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const closePopup = () => {
    showPopup.value = false;
};
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

                * {
                    word-break: break-all;
                }
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

                * {
                    word-break: break-all;
                }

                p {
                    color: #787878;
                }
            }
        }
    }

    .action-buttons {
        width: 100%;
        flex-direction: column;

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


}
</style>