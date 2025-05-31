<template>
    <ChatLayout>
        <div class="chat-block">
            <AllChats @open-dialog="openDialog"
                :class="{ 'mobile-hidden': isMobileView && (selectedChat || settingsIsOpen), 'mobile-full': isMobileView && !selectedChat }" />
            <OpenEmpty v-if="!selectedChat && !isMobileView" />
            <OpenDialog v-if="selectedChat && !settingsIsOpen" @openSettings="openSettings" :isMobile="isMobileView"
                @backToAllChats="goBackToChats" :class="{ 'mobile-full': isMobileView && selectedChat }" />
            <ChatSettings v-if="selectedChat && settingsIsOpen" :class="{ 'mobile-full': isMobileView }" />
        </div>
    </ChatLayout>
</template>

<script setup>
import axios from 'axios';
import { provide, ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getChats, createChat as apiCreateChat, deleteChat as apiDeleteChat, addMembersToChat } from '@/api/modules/chat.api';
import { getUser } from '@/api/modules/adminUsers.api';

import ChatLayout from '@/layouts/ChatLayout.vue';
import AllChats from './components/all/AllChats.vue';
import OpenEmpty from './components/open/OpenEmpty.vue';
import OpenDialog from './components/open/OpenDialog.vue';
import ChatSettings from './components/open/settings/ChatSettings.vue';

const router = useRouter();
const route = useRoute();

const isLoading = ref(false)
const selectedChat = ref()
const chats = ref([])
const originalChats = ref([])
const settingsIsOpen = ref(false)

const windowWidth = ref(window.innerWidth);
const isMobileView = computed(() => windowWidth.value <= 930);

const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth;
};


const openDialog = (dialog) => {
    chats.value.map(chat => {
        chat.choosen = false
    })
    settingsIsOpen.value = false
    selectedChat.value = dialog
    selectedChat.value.choosen = true
    router.push({
        name: 'ChatDialog',
        params: { chatId: dialog.id }
    });
}

const goBackToChats = () => {
    if (settingsIsOpen.value) {
        settingsIsOpen.value = false;
        router.push({
            name: 'ChatDialog',
            params: { chatId: selectedChat.value.id }
        });
    } else {
        selectedChat.value = null;
        router.push({ name: 'Chat' });
    }
};

const openSettings = () => {
    settingsIsOpen.value = true
    if (selectedChat.value.is_group === 1) {
        router.push({
            name: 'Members',
            params: { chatId: selectedChat.value.id }
        });
    } else {
        router.push({
            name: 'Documents',
            params: { chatId: selectedChat.value.id }
        });
    }
}

const fetchChats = async () => {
    try {
        isLoading.value = true;

        const chatsData = await getChats();
        const chatsWithUsers = await Promise.all(
            chatsData.map(async (chat) => {
                if (!chat.user_id) {
                    return chat;
                }

                const userData = await getUser(chat.user_id);

                const userName = userData?.name || 'Пользователь не найден';

                return {
                    ...chat,
                    userName
                };
            })
        );

        chats.value = chatsWithUsers;
        originalChats.value = [...chatsWithUsers];

        if (route.params.chatId) {
            const chatToOpen = chatsWithUsers.find(chat => chat.id == route.params.chatId);
            if (chatToOpen) {
                openDialog(chatToOpen);
            }
        }
    } finally {
        isLoading.value = false;
    }
};

const deleteChat = async (id) => {
    try {
        await apiDeleteChat(id)
        selectedChat.value = null
        await fetchChats()
    } catch (err) { console.log(err) }
}

const createChat = async (newChat) => {
    try {
        // Создаем чат с названием и типом
        const response = await apiCreateChat({
            title: newChat.title,
            is_group: newChat.isGroup,
            avatar: newChat.avatar // Добавляем аватар
        });

        const createdChat = response.data;
        await fetchChats(); // Обновляем список чатов

        return createdChat; // Возвращаем созданный чат
    } catch (err) {
        console.error('Ошибка создания чата:', err);
        throw err;
    }
};

const addMembers = async (newMembers) => {
    try {
        await addMembersToChat(selectedChat.value.id, newMembers)
        await fetchChats()
    } catch (err) {
        console.error('Ошибка при добавлении участников:', err);
    }
};

watch(() => route.params.chatId, (newChatId) => {
    if (newChatId) {
        const chatToOpen = chats.value.find(chat => chat.id == newChatId);
        if (chatToOpen) {
            openDialog(chatToOpen);
        }
    } else {
        selectedChat.value = null;
    }
});

provide('selectedChat', selectedChat)
provide('chats', chats)
provide('isLoading', isLoading)
provide('originalChats', originalChats)
provide('settingsIsOpen', settingsIsOpen)
provide('createChat', createChat)
provide('deleteChat', deleteChat)
provide('addMembers', addMembers)

onMounted(async () => {
    selectedChat.value = null
    await fetchChats()
    window.addEventListener('resize', updateWindowWidth);
})
</script>

<style scoped lang="scss">
.chat-block {
    display: flex;
    position: relative;
    height: 100%;

    @media (max-width: 930px) {
        .mobile-hidden {
            display: none !important;
        }

        .mobile-full {
            max-width: 100% !important;
            width: 100% !important;

            :deep(.dialogs) {
                padding: 0;
                margin: 0 10px;
                border-radius: 10px;
                border: 1px solid #D9D9D9;
            }
        }
    }
}
</style>