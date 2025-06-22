<template>
    <div class="open" v-bind="$attrs">
        <div class="dialog-header">
            <div class="dialog-header__inner" :class="{ 'mobile-header': isMobile }"
                @click="() => emit('openSettings')">
                <div class="left-part">
                    <div class="f-row">
                        <button v-if="isMobile" class="icon" @click="() => emit('backToAllChats')">
                            <img class="arrow-left" src="/icons/arrow.svg" alt="">
                        </button>
                        <img v-if="selectedChat.avatar" class="avatar" :src="getAvatarUrl(selectedChat.avatar)">
                        <AvatarLetter v-else :name="selectedChat.title" />
                        <h1>{{ selectedChat.title }}</h1>
                    </div>
                    <p v-if="selectedChat.is_group === 1" class="am-members">{{ pluralizeParticipants }}</p>
                </div>

                <div v-if="selectedChat.is_group === 1" class="right-part">
                    <button class="icon" @click.stop="openAddModal">
                        <img src="/icons/actions/add.svg" alt="">
                    </button>
                    <button class="icon" @click.stop="openConfirmDeleteModal">
                        <img src="/icons/actions/delete.svg" alt="">
                    </button>
                </div>
            </div>
        </div>

        <div v-if="messages.length > 0" class="messages-in-chat">
            <div class="spacer"></div>
            <Message v-for="message in messages" :key="message.id" :message="message" />
        </div>

        <Loading v-else-if="isLoading" />

        <NoMessages v-else />

        <div v-if="attachedFiles.length > 0" class="files">
            <FileCard v-for="file in attachedFiles" :key="file.name" :file="file" @delete-file="deleteFile" />
        </div>

        <div class="input-field">
            <button class="icon" @click="fileUpload">
                <img src="/icons/actions/paperclip.svg" alt="">
            </button>

            <div class="center">
                <p v-if="limitMessage.length > 0" class="limit-message">{{ limitMessage }}</p>
                <input ref="input" placeholder="Отправить сообщение..." type="text" class="inp-field"
                    @keydown.enter="sendMessage">
            </div>

            <button class="icon bigger" @click="sendMessage">
                <img src="/icons/actions/send.svg" alt="">
            </button>
        </div>
    </div>

    <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить чат?"
        text="Удалённую переписку нельзя будет восстановить" right-button-text="Удалить"
        @confirm="deleteChat(selectedChat.id)" @cancel="closeModal" />

    <AddUserModal v-if="showAddModal" :members="selectedChat.members" @cancel="closeModal" @add="addToExistingChat"
        right-button-text="Добавить" />
</template>

<script setup>
import pluralize from 'pluralize-ru';
import { inject, watch, ref, computed, onMounted, nextTick } from 'vue';
import { getChatMessages, getChat, getChatMembers, createMessage } from '@/api/modules/chat';

import NoMessages from './components/NoMessages.vue';
import Message from '@/components/Message.vue';
import FileCard from './components/FileCard.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import AddUserModal from './components/modals/AddUserModal.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';
import Loading from '@/components/Loading.vue';

const emit = defineEmits(['openSettings', 'backToAllChats'])
const deleteChat = inject('deleteChat')
const addMembers = inject('addMembers');

defineProps({ isMobile: Boolean })

defineOptions({
    inheritAttrs: false
})

const selectedChat = inject('selectedChat')
const input = ref(null)
const limitMessage = ref('')
const messages = ref([])
const attachedFiles = ref([])

const showConfirmDeleteModal = ref(false)
const showAddModal = ref(false)

const isLoading = ref(false)

const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.messages-in-chat');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

const fetchMessages = async () => {
    try {
        isLoading.value = true
        messages.value = await getChatMessages(selectedChat.value.id)
        messages.value.sort((a, b) =>
            new Date(a.created_at) - new Date(b.created_at)
        );
    } finally {
        isLoading.value = false
        nextTick(() => { scrollToBottom() })
    }
}

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/icons/avatar.png';
    return `https://api-course.hellishworld.ru${avatarPath}`;
}

const fetchMembers = async () => {
    try {
        isLoading.value = true
        selectedChat.value.members = await getChatMembers(selectedChat.value.id)
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
    if (showAddModal.value) { showAddModal.value = false }
}

const openAddModal = () => {
    showAddModal.value = true
}

const openConfirmDeleteModal = () => {
    showConfirmDeleteModal.value = true
}

const pluralizeParticipants = computed(() => {
    const count = Number(selectedChat.value.members_count);
    return count + ' ' + pluralize(count, 'нет участников', 'участник', 'участника', 'участников');
});

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
                limitMessage.value = 'Недопустимое расширение файлов'
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
    const text = input.value.value.trim();

    if (!text && attachedFiles.value.length === 0) return;
    if (text.split('').length > 2048) {
        limitMessage.value = 'Длина сообщения не должна превышать 2048 символов'
        return
    } else { limitMessage.value = '' }
    if (attachedFiles.value.length > 10) {
        limitMessage.value = 'Вы можете прикрепить не более 10 файлов'
        return
    }

    try {
        await createMessage(
            selectedChat.value.id,
            text || null,
            attachedFiles.value.map(f => f.file)
        );

        input.value.value = '';
        attachedFiles.value = [];
        await fetchMessages();

        nextTick(() => {
            scrollToBottom();
        });
    } catch (error) {
        console.error('Ошибка отправки сообщения', error);
    }
    finally {
        limitMessage.value = ''
    }
};

const deleteFile = (file) => {
    attachedFiles.value = attachedFiles.value.filter(item => item.name !== file.name)
    if (attachedFiles.value.length <= 10) {
        limitMessage.value = ''
    }
}

const addToExistingChat = async (members) => {
    try {
        closeModal()
        const memberIds = members.map(m => m.id);

        await addMembers(selectedChat.value.id, memberIds);

        const response = await getChat(selectedChat.value.id);
        selectedChat.value = response;
        await fetchMembers()
    } catch (error) {
        console.error("Ошибка добавления участников", error);
    }
};

watch(selectedChat, async (newChat) => {
    if (!selectedChat.value) { return }
    messages.value = []
    await fetchMessages()
    await fetchMembers()
}, { immediate: true })

onMounted(async () => {
    await fetchMembers()
    await fetchMessages()
})
</script>

<style scoped lang="scss">
.open {
    flex: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .dialog-header {
        width: 100%;
        border-bottom: 1px solid #D9D9D9;

        .dialog-header__inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 60px 10px 20px 20px;
            cursor: pointer;
            position: relative;

            .f-row {
                display: flex;
                align-items: center;
                gap: 10px;

                h1 {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    margin: 0;
                    padding: 0;
                    word-break: break-all;
                }

                .avatar {
                    width: 40px;
                    height: auto;
                    max-height: 50px;
                    border-radius: 4px;
                    object-fit: cover;
                }
            }

            .right-part {
                display: flex;
                gap: 5px;
            }

            .am-members {
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0px;
                color: #787878;
                margin-top: 10px;
            }
        }
    }

    .messages-in-chat {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 10px;
        gap: 10px;
        flex: 1;
        scroll-behavior: smooth;

        .message {
            margin: 0;
        }
    }

    .loading-dots {
        flex: 1;
    }

    .files {
        padding: 5px 10px;
        width: 100%;
        max-width: 100%;
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
        padding: 7px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #D9D9D9;

        .center {
            flex: 1;

            .limit-message {
                padding-left: 5px;
                color: red;
                font-size: 12px;
            }

            input {
                width: 100%;
            }
        }

        img {
            width: 24px;
            height: 24px;

        }

        .inp-field {
            flex: 1;
            padding: 10px 5px;
            border: none;
            outline: none;
        }
    }
}

@media (max-width:1280px) {
    .open {

        .dialog-header__inner {
            margin: 15px 10px 10px 20px !important;

            &.mobile-header {
                margin: 40px 10px 20px 20px !important;
                justify-content: center;

                .right-part {
                    position: absolute;
                    top: 0;
                    right: 10px;
                }
            }
        }

        .messages-in-chat {
            padding: 15px;
        }
    }
}
</style>