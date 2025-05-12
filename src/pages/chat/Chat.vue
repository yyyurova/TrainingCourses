<template>
    <ChatLayout>
        <div class="chat-block">
            <AllChats @open-dialog="openDialog" />
            <OpenEmpty v-if="!selectedChat" />
            <OpenDialog v-else />
        </div>
    </ChatLayout>
</template>

<script setup>
import axios from 'axios';
import { provide, ref, onMounted } from 'vue';

import ChatLayout from '@/layouts/ChatLayout.vue';
import AllChats from './components/AllChats.vue';
import OpenEmpty from './components/OpenEmpty.vue';
import OpenDialog from './components/OpenDialog.vue';

const isLoading = ref(false)
const selectedChat = ref()
const chats = ref([])
const originalChats = ref([])

const openDialog = (dialog) => {
    chats.value.map(chat => {
        chat.choosen = false
    })
    selectedChat.value = dialog
    selectedChat.value.choosen = true
    // console.log(selectedChat.value)
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
    } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
    }
    finally {
        isLoading.value = false
    }
};

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