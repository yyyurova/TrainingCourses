<template>
    <div class="all">
        <div class="top">
            <h1>Чаты</h1>
            <button class="blue">Создать группу
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12H20M12 4V20" stroke="#F5F5F5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <Card class="no-hover">
                <img src="/icons/search.svg" alt="">
                <input v-model="nameInput" @input="searchChat" autocomplete="off" type="text"
                    placeholder="Поиск участников">
            </Card>
        </div>
        <Loading v-if="isLoading" />
        <div class="dialogs">
            <component :class="chat.choosen ? 'choosen' : ''" @click="() => emit('openDialog', chat)"
                v-for="chat in chats" @delete="openConfirmDeleteModal" :key="chat.id"
                :is="chat.members ? GroupDialogCard : DialogCard" :chat="chat" />
        </div>
        <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить чат?"
            text="Удалённую переписку нельзя будет восстановить" right-button-text="Удалить" @confirm="deleteChat"
            @cancel="closeModal" />
    </div>
</template>

<script setup>
import axios from 'axios';
import { inject, onMounted, ref } from 'vue';

import Card from '@/components/Card.vue';
import DialogCard from './DialogCard.vue';
import GroupDialogCard from './GroupDialogCard.vue';
import Loading from '@/components/Loading.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';

const emit = defineEmits(['openDialog'])

const chats = inject('chats')
const nameInput = ref('')
const showConfirmDeleteModal = ref(false)
const isLoading = inject('isLoading')

const closeModal = () => {
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
}

const openConfirmDeleteModal = () => {
    showConfirmDeleteModal.value = true
}

const deleteChat = async (id) => {
    try {
        closeModal()
        // isLoading.value = true
        await axios.delete(`https://c1a9f09250b13f61.mokky.dev/chats/${id}`)
        await fetchChats()
    } catch (err) { console.log(err) }
    // finally { isLoading.value = false }
}

const searchChat = () => {
    if (!nameInput.value.trim()) {
        chats.value = [...originalChats.value];
        return;
    }

    const searchTerm = nameInput.value.trim().toLowerCase();
    chats.value = originalChats.value.filter(chat =>
        chat.userName && chat.userName.toLowerCase().includes(searchTerm)
    )
}

</script>

<style scoped lang="scss">
.all {
    display: flex;
    flex-direction: column;
    // gap: 10px;
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
</style>