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

        <div class="members-in-group">
            <MemberCard v-for="member in filteredMembers" :key="member.id" :member="member"
                @delete="openDeleteMemberModal(member)" />
        </div>
    </div>
    <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить участника?" right-button-text="Удалить"
        @cancel="closeModal" @confirm="deleteMember(memberToDelete)" />
    <AddUserModal v-if="showAddModal" :members="chat.members" @cancel="closeModal" @confirm="handleAddMembers"
        rightButtonText="Добавить" />
</template>

<script setup>
import { inject, ref, computed, onMounted, provide } from 'vue';
import axios from 'axios';

import MemberCard from './MemberCard.vue';
import Card from '@/components/Card.vue';
import AddUserModal from '../../../components/modals/AddUserModal.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';

const chat = inject('selectedChat');
const allMembers = ref([]);
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

const fetchMembers = async () => {
    if (!chat.value?.members?.length) {
        allMembers.value = [];
        return;
    }

    try {
        const params = new URLSearchParams();
        chat.value.members.forEach(id => params.append('id[]', id));

        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users?${params.toString()}`);
        allMembers.value = data;
    } catch (err) {
        console.error('Ошибка при загрузке участников:', err);
        allMembers.value = [];
    }
};

const handleAddMembers = async (newMembers) => {
    try {
        const updatedMembers = [...chat.value.members, ...newMembers.map(m => m.id)];

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/chats/${chat.value.id}`, {
            members: updatedMembers
        });

        chat.value.members = updatedMembers;
        await fetchMembers();
    } catch (err) {
        console.error('Ошибка при добавлении участников:', err);
    }
};

const openDeleteMemberModal = (member) => {
    memberToDelete.value = member
    showConfirmDeleteModal.value = true
}

const deleteMember = async (member) => {
    closeModal()
    try {
        const updatedMembers = chat.value.members.filter(memberId => memberId !== member.id);

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/chats/${chat.value.id}`, {
            members: updatedMembers
        });

        chat.value.members = updatedMembers;
        await fetchMembers();
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

onMounted(fetchMembers);
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
}
</style>