<template>
    <div class="members__inner">
        <button class="transparent" @click="openAddModal">
            Добавить участника
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M12 4V20" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>

        <Card class="no-hover">
            <img src="/icons/search.svg" alt="">
            <input v-model="searchQuery" @input="handleSearch" autocomplete="off" type="text"
                placeholder="Поиск участников">
        </Card>

        <div class="members-in-group" v-if="filteredMembers.length > 0">
            <MemberCard v-for="member in filteredMembers" :key="member.id" :member="member"
                @delete="openDeleteMemberModal(member)" />
        </div>

        <div v-else-if="searchQuery.trim() !== ''" class="no-results">
            <p>Нет результатов по запросу</p>
        </div>
        <div v-else class="no-members">
            <p>В этом чате нет участников</p>
        </div>
    </div>
    <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить участника?" right-button-text="Удалить"
        @cancel="closeModal" @confirm="deleteMember(memberToDelete)" />
    <AddUserModal v-if="showAddModal" :members="chat.members" @cancel="closeModal" @add="addToExistingChat"
        rightButtonText="Добавить" />
</template>

<script setup>
import { inject, ref, computed, onMounted, provide } from 'vue';
import axios from 'axios';
import { deleteMember as apiDeleteMember } from '@/api/modules/chat.api';

import MemberCard from './MemberCard.vue';
import Card from '@/components/Card.vue';
import AddUserModal from '../../../components/modals/AddUserModal.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';

const chat = inject('selectedChat');
console.log(chat.value)
const addMembers = inject('addMembers');

const allMembers = ref(chat.value.members);
const searchQuery = ref('');
const showAddModal = ref(false)
const showConfirmDeleteModal = ref(false)
const memberToDelete = ref(null)

const closeModal = () => {
    if (showAddModal.value) { showAddModal.value = false }
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
}

const openAddModal = () => {
    showAddModal.value = true
}

const filteredMembers = computed(() => {
    if (!searchQuery.value.trim()) {
        return allMembers.value;
    }

    const query = searchQuery.value.trim().toLowerCase();
    return allMembers.value.filter(member =>
        member.name && member.name.toLowerCase().includes(query)
    );
});

const addToExistingChat = async (members) => {
    try {
        closeModal()
        const memberIds = members.map(m => m.id);

        await addMembers(memberIds);

        const response = await getChat(chat.value.id);
        chat.value = response;
        await fetchMembers()
    } catch (error) {
        console.error("Ошибка добавления участников", error);
    }
};

const openDeleteMemberModal = (member) => {
    memberToDelete.value = member
    showConfirmDeleteModal.value = true
}

const deleteMember = async (member) => {
    closeModal()
    try {
        const updatedMembers = chat.value.members.filter(m => m.id !== member.id);
        await apiDeleteMember(chat.value.id, member.id)

        chat.value.members = updatedMembers;
        chat.value.members_count--
    } catch (err) {
        console.error('Ошибка при добавлении участников:', err);
    }
}

let searchTimeout = null;
const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
    }, 300);
};

provide('members', chat.members)
</script>

<style scoped lang="scss">
.members__inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;

    button.transparent {
        border: 1px solid #513DEB;
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

    .members-in-group {
        padding-right: 4px;
        display: flex;
        flex-direction: column;
        gap: 7px;
        overflow-y: auto;
    }

    .no-results,
    .no-members {
        width: 100%;
        text-align: center;

        p {
            font-size: 19px;
            font-weight: 550;
        }

    }
}
</style>