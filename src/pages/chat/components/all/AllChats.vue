<template>
    <div class="all">
        <div class="top">
            <h1>Чаты</h1>
            <button class="blue" @click="openCreateGroupModal">Создать группу
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H20M12 4V20" stroke="#F5F5F5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>

            <Card class="no-hover">
                <img src="/icons/actions/search.svg" alt="">
                <input v-model="nameInput" @input="searchChat" autocomplete="off" type="text"
                    placeholder="Поиск участников">
            </Card>
        </div>

        <Loading v-if="isLoading" />

        <div class="dialogs" v-else-if="chats.length > 0">
            <component :class="chat.choosen ? 'choosen' : ''" @click="() => emit('openDialog', chat)"
                v-for="chat in chats" @delete="openConfirmDeleteModal(chat)" :key="chat.id"
                :is="chat.is_group === 1 ? GroupDialogCard : DialogCard" :chat="chat" />
        </div>

        <div class="no-items" v-else-if="nameInput.trim() !== '' && chats.length === 0">
            <p>Нет результатов по запросу</p>
        </div>

        <div class="no-items" v-else>
            <p>У вас пока нет ни одного чата.</p>
        </div>

        <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить чат?"
            text="Удалённую переписку нельзя будет восстановить" right-button-text="Удалить" @confirm="deleteChat"
            @cancel="closeModal" />

        <CreateChatModalVue v-if="showCreateGroupModal" @cancel="closeModal" @next="openChooseMembersModal" />

        <AddUserModal v-if="showChooseMembersModal" @cancel="closeModal" @add="addMembersToNewChat"
            right-button-text="Создать" />

    </div>
</template>

<script setup>
import { inject, ref } from 'vue';

import Card from '@/components/Card.vue';
import DialogCard from './components/DialogCard.vue';
import GroupDialogCard from './components/GroupDialogCard.vue';
import Loading from '@/components/Loading.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import CreateChatModalVue from './components/modals/CreateChatModal.vue';
import AddUserModal from '../open/components/modals/AddUserModal.vue';

const emit = defineEmits(['openDialog'])
const createChat = inject('createChat')
const addMembers = inject('addMembers')
const deleteChatInjection = inject('deleteChat')

const chats = inject('chats')
const nameInput = ref('')

const showConfirmDeleteModal = ref(false)
const showCreateGroupModal = ref(false)
const showChooseMembersModal = ref(false)

const isLoading = inject('isLoading')
const originalChats = inject('originalChats')

const selectedToDeleteChat = ref(null)
const createdChat = ref(null);

const closeModal = () => {
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
    if (showCreateGroupModal.value) { showCreateGroupModal.value = false }
    if (showChooseMembersModal.value) { showChooseMembersModal.value = false }
}

const openCreateGroupModal = () => {
    showCreateGroupModal.value = true
}

const openChooseMembersModal = async (newChat) => {
    try {
        showCreateGroupModal.value = false;
        showChooseMembersModal.value = true;
        createdChat.value = await createChat(newChat);
    } catch (error) {
        console.error("Ошибка при создании чата", error);
    }
};

const addMembersToNewChat = async (members) => {
    if (!createdChat.value) return;

    try {
        closeModal()
        const memberIds = members.map(m => m.id);
        await addMembers(createdChat.value.id, memberIds)
        emit('openDialog', createdChat.value)
    } catch (error) {
        console.error("Ошибка добавления участников", error);
    } finally {
        closeModal();
        createdChat.value = null;
    }
};

const deleteChat = () => {
    deleteChatInjection(selectedToDeleteChat.value.id)
    closeModal()
    selectedToDeleteChat.value = null
}

const openConfirmDeleteModal = (chat) => {
    showConfirmDeleteModal.value = true
    selectedToDeleteChat.value = chat
}

const searchChat = () => {
    if (!nameInput.value.trim()) {
        chats.value = [...originalChats.value];
        return;
    }

    const searchTerm = nameInput.value.trim().toLowerCase();
    chats.value = originalChats.value.filter(chat =>
        chat.title && chat.title.toLowerCase().includes(searchTerm)
    )
}
</script>

<style scoped lang="scss">
.all {
    display: flex;
    flex-direction: column;
    border-left: 1px solid #D9D9D9;
    border-right: 1px solid #D9D9D9;
    width: 45%;
    max-width: 45%;
    height: 100vh;

    .top {
        padding: 55px 10px 10px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .card {
        width: 100%;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;

        input {
            outline: none;
            border: none;
            padding: 0;
            border-radius: 0;
        }
    }

    .dialogs {
        overflow-y: auto;

        .choosen {
            background-color: #E9F2FF;
        }
    }
}

@media (max-width:1280px) {
    .all {
        width: 300px;
    }
}
</style>