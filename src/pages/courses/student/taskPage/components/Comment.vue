<template>
    <Card class="no-hover comment">
        <h3>Комментарий к заданию</h3>
        <div class="chat-about-task">
            <div v-if="messages.length > 0" class="messages-in-task" id="messages">
                <div class="spacer"></div>
                <Message v-for="message in messages" :key="message.id" :message="message" />
            </div>

            <Loading v-else-if="isLoading" />

            <div class="no-items" v-else>
                <p>В чате нет сообщений</p>
            </div>

            <div v-if="attachedFiles.length > 0" class="files">
                <FileCard v-for="file in attachedFiles" :key="file.name" :file="file" @delete-file="deleteFile" />
            </div>

            <div class="input-field">
                <button class="icon" @click="fileUpload">
                    <img class="small" src="/icons/paperclip.svg" alt="">
                </button>

                <div class="center">
                    <p v-if="limitMessage.length > 0" class="limit-message">{{ limitMessage }}</p>
                    <input autocomplete="off" ref="messageInput" @keypress.enter="sendMessage"
                        placeholder="Добавить комментарий к заданию" type="text" class="inp-field">
                </div>

                <button class="icon" @click="sendMessage">
                    <img src="/icons/send.svg" alt="">
                </button>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { getChatMessages, createMessage } from '@/api/modules/chat';

import Card from '@/components/Card.vue';
import FileCard from '@/pages/chat/components/open/components/FileCard.vue';
import Message from '@/components/Message.vue';
import Loading from '@/components/Loading.vue';

const props = defineProps({ chat: Object })

const chatId = computed(() => props.chat?.id);

const messages = ref([]);
const messageInput = ref(null);
const limitMessage = ref('');
const attachedFiles = ref([]);
const isLoading = ref(false);

const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

const fetchMessages = async () => {
    if (!chatId.value) return;

    try {
        isLoading.value = true;
        messages.value = await getChatMessages(chatId.value);
        messages.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        console.log(messages.value)
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    } finally {
        isLoading.value = false;
        nextTick(() => { scrollToBottom() });
    }
};

const fileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt';

    fileInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.txt)$/i;

        files.forEach(file => {
            if (!allowedExtensions.exec(file.name)) {
                limitMessage.value = 'Недопустимое расширение файлов';
                return;
            }

            attachedFiles.value.push({
                name: file.name,
                size: formatFileSize(file.size),
                file: file
            });
        });
    };

    fileInput.click();
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const sendMessage = async () => {
    const text = messageInput.value.value.trim();

    if (!text && attachedFiles.value.length === 0) return;
    if (text.length > 2048) {
        limitMessage.value = 'Длина сообщения не должна превышать 2048 символов';
        return;
    } else {
        limitMessage.value = '';
    }
    if (attachedFiles.value.length > 10) {
        limitMessage.value = 'Вы можете прикрепить не более 10 файлов';
        return;
    }

    try {
        await createMessage(
            props.chat.id,
            text || null,
            attachedFiles.value.map(f => f.file)
        );

        messageInput.value.value = '';
        attachedFiles.value = [];
        await fetchMessages();
    } catch (error) {
        console.error('Ошибка отправки комментария', error);
    } finally {
        limitMessage.value = '';
    }
};

const deleteFile = (file) => {
    attachedFiles.value = attachedFiles.value.filter(item => item.name !== file.name);
    if (attachedFiles.value.length <= 10) {
        limitMessage.value = '';
    }
};

watch(
    () => props.chat,
    (newChat) => {
        if (newChat?.id) {
            fetchMessages();
        }
    },
    { immediate: true }
);

</script>

<style scoped lang="scss">
.comment {
    padding: 0;
    border-radius: 8px;

    h3 {
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        letter-spacing: 1px;
        margin-bottom: 20px;
        padding: 20px;
    }

    .chat-about-task {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-height: 400px;
        min-height: 200px;

        .messages-in-task {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            padding: 10px;
            gap: 10px;

            .spacer {
                flex: 1;
            }
        }

        :deep(.loading-dots) {
            flex: 1;
        }

        .no-items {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100px;

            p {
                color: #8f8f8f;
            }
        }

        .files {
            padding: 5px 10px;
            width: 100%;
            overflow-x: auto;
            border-top: 1px solid #D9D9D9;
            white-space: nowrap;
            max-height: 70px;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 10px;
        }

        .input-field {
            width: 100%;
            padding: 7px 12px 0 12px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: 0 0 8px 8px;
            border-top: 1px solid #D9D9D9;
            background: white;
            position: sticky;
            bottom: 0;

            .center {
                flex: 1;
                min-width: 0;

                .limit-message {
                    padding-left: 5px;
                    color: red;
                    font-size: 12px;
                    white-space: normal;
                }
            }

            button.icon img.small {
                width: 28px;
            }
        }

        .inp-field {
            flex: 1;
            padding: 10px;
            border: none;
            outline: none;
            width: 100%;
            min-width: 0;
        }
    }
}
</style>