<template>
    <ChatLayout>
        <div class="chat-block">
            <AllChats @open-dialog="openDialog" />
            <OpenEmpty v-if="!selectedChat" />
            <OpenDialog v-if="selectedChat && !settingsIsOpen" @openSettings="openSettings" />
            <ChatSettings v-if="selectedChat && settingsIsOpen" />
        </div>
    </ChatLayout>
</template>

<script setup>
import axios from 'axios';
import { provide, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

const openSettings = () => {
    settingsIsOpen.value = true
    router.push({
        name: 'Members',
        params: { chatId: selectedChat.value.id }
    });
}

const fetchChats = async () => {
    try {
        isLoading.value = true
        const params = { sortBy: '-date' };
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/chats`, { params });

        const chatsWithUsers = await Promise.all(data.map(async chat => {
            if (!chat.user_id) {
                return {
                    ...chat,
                };
            }

            try {
                const userResponse = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users/${chat.user_id}`);
                return {
                    ...chat,
                    userName: userResponse.data.name || 'Неизвестный пользователь'
                };
            } catch (error) {
                console.error(`Ошибка загрузки пользователя ${chat.user_id}:`, error);
                return {
                    ...chat,
                    userName: 'Пользователь не найден'
                };
            }
        }));

        chats.value = chatsWithUsers;
        originalChats.value = [...chatsWithUsers];

        // Если есть параметр chatId в URL, открываем соответствующий чат
        if (route.params.chatId) {
            const chatToOpen = chatsWithUsers.find(chat => chat.id == route.params.chatId);
            if (chatToOpen) {
                openDialog(chatToOpen);
            }
        }
    } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
    }
    finally {
        isLoading.value = false
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

onMounted(async () => {
    selectedChat.value = null
    await fetchChats()
})
</script>

<style scoped lang="scss">
.chat-block {
    display: flex;
}
</style>