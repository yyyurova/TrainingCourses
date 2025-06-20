<template>
    <div class="selected-practicant">
        <div class="top">
            <img v-if="practicant.avatar" :src="practicant.avatar" alt="">
            <AvatarLetter v-else :name="practicant.name" />
            <p>{{ practicant.name }}</p>
            <input type="number" min="1" max="10" v-model="localMark" placeholder="Оценка" @input="updateMark">
        </div>

        <div class="files" v-if="files.length > 0">
            <Card v-for="file in files" :key="file.id" class="no-hover">
                <img src="/icons/file.svg" alt="">
                <div class="file__inner">
                    <a :href="file.url">{{ file.name }}</a>
                    <p>{{ format(file.created_at, { date: 'short', time: 'short' }) }} ({{ formatFileSize(file.size) }})
                    </p>
                </div>
            </Card>
        </div>

        <div class="links" v-if="links.length > 0">
            <Card class="no-hover" v-for="link in links" :key="link.id">
                <img src="/icons/link.svg">
                <div class="link__inner">
                    <a target="_blank" :href="link.url">{{ link.url }}</a>
                    <p>{{ format(link.created_at, { date: 'short', time: 'short' }) }} </p>
                </div>
            </Card>
        </div>

        <div class="no-items" v-if="links.length === 0 && files.length === 0">
            <p>Этот практикант пока ничего не сдавал</p>
        </div>

        <div class="task-comments">
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
        </div>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';
import { computed, watch, ref, onMounted, nextTick } from 'vue';
import { createMessage, getChatMessages } from '@/api/modules/chat';
import { getTaskChat } from '@/api/modules/tasks';

import Card from '@/components/Card.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';
import Message from '@/components/Message.vue';
import FileCard from '@/pages/chat/components/open/components/FileCard.vue';
import Loading from '@/components/Loading.vue';

const props = defineProps({
    practicant: Object,
    mark: [Number, String],
    taskId: Number
});

const emit = defineEmits(['update:mark']);

const chat = ref(null)
const messages = ref([]);

const messageInput = ref(null);
const limitMessage = ref('');
const attachedFiles = ref([]);
const isLoading = ref(false);

const localMark = ref(props.mark || '');

const files = computed(() => {
    return props.practicant.files.filter(f => f.type !== 'link')
})

const links = computed(() => {
    return props.practicant.files.filter(f => f.type === 'link')
})

const formatFileSize = (sizeInMB) => {
    const sizeInKB = sizeInMB * 1024;
    if (sizeInMB < 0.1) {
        return `${sizeInKB.toFixed(2)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
};

const updateMark = () => {
    emit('update:mark', localMark.value);
};

const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

const fetchMessages = async () => {
    try {
        isLoading.value = true;
        messages.value = await getChatMessages(chat.value.id);
        messages.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    } finally {
        isLoading.value = false;
        nextTick(() => { scrollToBottom() });
    }
};

const fetchChat = async () => {
    try {
        isLoading.value = true
        chat.value = await getTaskChat(props.taskId, props.practicant.id)
    } finally { isLoading.value = false }
}

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

const sendMessage = async () => {
    isLoading.value = true
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
            chat.value.id,
            text || null,
            attachedFiles.value.map(f => f.file)
        );

        messageInput.value.value = '';
        attachedFiles.value = [];
        await fetchMessages();
    } catch (error) {
        console.error('Ошибка отправки комментария', error);
    } finally {
        isLoading.value = false
        limitMessage.value = '';
    }
};

const deleteFile = (file) => {
    attachedFiles.value = attachedFiles.value.filter(item => item.name !== file.name);
    if (attachedFiles.value.length <= 10) {
        limitMessage.value = '';
    }
};

onMounted(async () => {
    await fetchChat()
    await fetchMessages();
});

watch(() => props.mark, (newVal) => {
    localMark.value = newVal;
});

watch(() => props.practicant, async (newPr) => {
    await fetchChat()
    await fetchMessages()
})
</script>

<style scoped lang="scss">
.selected-practicant {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &:not(:last-child) {
        border-bottom: 1px solid #D9D9D9;
    }

    .top {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px;

        p {
            flex: 1;
        }

        img {
            width: 35px;
            height: auto;
        }

        input {
            width: 30%;
            flex: none;
        }
    }

    .links,
    .files {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;

        .card {
            width: 100%;
            max-width: 100%;
            flex-direction: row;
            align-items: center;
            gap: 10px;

            .file__inner,
            .link__inner {
                flex: 1;

                * {
                    word-break: break-all;
                }

                p {
                    margin-top: 5px;
                    color: #787878;
                }
            }
        }
    }
}

.task-comments {
    margin-top: 20px;
    border-top: 1px solid #D9D9D9;
    padding-top: 20px;

    h3 {
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        letter-spacing: 1px;
        margin-bottom: 20px;
        padding: 0 20px;
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