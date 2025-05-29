<template>
    <div class="open">
        <div class="dialog-header">
            <div class="dialog-header__inner" :class="{ 'mobile-header': isMobile }"
                @click="() => emit('openSettings')">
                <div class="left-part">
                    <div class="f-row">
                        <button v-if="isMobile" class="icon" @click="() => emit('backToAllChats')">
                            <img class="arrow-left" src="/icons/arrow.svg" alt="">
                        </button>
                        <img src="/icons/Avatar.svg">
                        <h1>{{ selectedChat.userName ? selectedChat.userName : selectedChat.name }}</h1>
                    </div>
                    <p v-if="selectedChat.members" class="am-members">{{ pluralizeParticipants }}</p>
                </div>

                <div v-if="selectedChat.members" class="right-part">
                    <button class="icon" @click.stop="openAddModal">
                        <img src="/icons/add.svg" alt="">
                    </button>
                    <button class="icon" @click.stop="openConfirmDeleteModal">
                        <img src="/icons/delete.svg" alt="">
                    </button>
                </div>
            </div>
        </div>
        <div v-if="selectedChat.content || messages.length > 0" class="messages-in-chat">
            <div class="spacer"></div>
            <Message v-for="(message, index) in messages" :key="index" :message="message" />
        </div>
        <NoMessages v-else />

        <div v-if="attachedFiles.length > 0" class="files">
            <FileCard v-for="file in attachedFiles" :key="file.name" :file="file" @delete-file="deleteFile" />
        </div>
        <div class="input-field">
            <button class="icon" @click="fileUpload">
                <img src="/icons/paperclip.svg" alt="">
            </button>

            <input ref="input" placeholder="Отправить сообщение..." type="text" class="inp-field">
            <button class="icon">
                <img src="/icons/emote-smile.svg" alt="">
            </button>
            <button class="icon" @click="sendMessage">
                <img src="/icons/send.svg" alt="">
            </button>
        </div>
    </div>
    <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить чат?"
        text="Удалённую переписку нельзя будет восстановить" right-button-text="Удалить"
        @confirm="deleteChat(selectedChat.id)" @cancel="closeModal" />
    <AddUserModal v-if="showAddModal" :members="selectedChat.members" @cancel="closeModal" @confirm="handleAddMembers"
        rightButtonText="Добавить" />
</template>

<script setup>
import axios from 'axios';
import pluralize from 'pluralize-ru';
import { inject, watch, ref, computed, onMounted } from 'vue';
import { format } from '@formkit/tempo';
import { decodeUtf8 } from '@/utils/utils';

import NoMessages from './components/NoMessages.vue';
import Message from '@/components/Message.vue';
import FileCard from './components/FileCard.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import AddUserModal from './components/modals/AddUserModal.vue';

const emit = defineEmits(['openSettings', 'backToAllChats'])
const deleteChat = inject('deleteChat')

defineProps({ isMobile: Boolean })

const selectedChat = inject('selectedChat')
const input = ref(null)
const messages = ref([])
const attachedFiles = ref([])

const showConfirmDeleteModal = ref(false)
const showAddModal = ref(false)

const handleAddMembers = async (newMembers) => {
    try {
        const updatedMembers = [...selectedChat.value.members, ...newMembers.map(m => m.id)];

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/chats/${selectedChat.value.id}`, {
            members: updatedMembers
        });

        selectedChat.value.members = updatedMembers;
        // await fetchMembers();
    } catch (err) {
        console.error('Ошибка при добавлении участников:', err);
    }
};

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
    const count = Number(selectedChat.value.members_count) || 0;
    return count + ' ' + pluralize(count, 'нет участников', 'участник', 'участника', 'участников');
});

const fileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*';
    fileInput.multiple = true;

    fileInput.onchange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => {
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

    let uploadedFiles = [];
    if (attachedFiles.value.length > 0) {
        try {
            uploadedFiles = await Promise.all(
                attachedFiles.value.map(async (fileObj) => {
                    const formData = new FormData();
                    formData.append('file', fileObj.file);

                    const res = await fetch('https://c1a9f09250b13f61.mokky.dev/uploads', {
                        method: 'POST',
                        body: formData
                    });

                    if (!res.ok) throw new Error('Ошибка загрузки файла');

                    return await res.json();
                })
            );
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            return;
        }
    }

    if (text) {
        messages.value.push({
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        });
    }

    if (uploadedFiles.length > 0) {
        messages.value.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            files: uploadedFiles.map(file => ({
                name: decodeUtf8(file.fileName),
                url: file.url,
                size: formatFileSize(file.bytes)
            }))
        });
    }

    input.value.value = '';
    attachedFiles.value = [];

    setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-in-chat');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 50);
};

const deleteFile = (file) => {
    attachedFiles.value = attachedFiles.value.filter(item => item.name !== file.name)
}

watch(selectedChat, (newChat) => {
    if (newChat.content) {
        messages.value = [{
            userName: newChat.userName || newChat.name,
            text: newChat.content,
            time: format(newChat.date, { time: 'short' })
        }]
    }
}, { immediate: true })

</script>
<style scoped lang="scss">
.open {
    // width: 55%;
    flex: 1;
    // max-width: 55%;
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

        .message {
            margin: 0;
        }
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

        img {
            width: 24px;
            height: 24px;
        }

        button:nth-child(4) img {
            width: 21px;
            height: 21px;
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