<template>
    <div class="modal">
        <div class="modal-content" @click.stop>
            <h2>Добавление участников в группу</h2>
            <Card class="no-hover search-block">
                <input v-model="nameInput" @input="handleInput" type="text" autocomplete="off"
                    placeholder="Начните вводить имя">
                <button v-if="nameInput" class="icon" @click="clearSearch">
                    <img src="/icons/x.svg" alt="Очистить поиск">
                </button>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.9265 17.0401L20.3996 20.4001M19.2796 11.4401C19.2796 15.77 15.7695 19.2801 11.4396 19.2801C7.1097 19.2801 3.59961 15.77 3.59961 11.4401C3.59961 7.11019 7.1097 3.6001 11.4396 3.6001C15.7695 3.6001 19.2796 7.11019 19.2796 11.4401Z"
                        stroke="#292929" stroke-linecap="round" />
                </svg>
            </Card>
            <div class="dropdown">
                <div v-for="member in filteredMembers" :key="member.id" class="item">
                    <input type="checkbox" :checked="isSelected(member)" @click="toggleMember(member)">
                    <img src="/icons/Avatar.svg" :alt="member.name">
                    <span>{{ member.name }}</span>
                </div>
            </div>
            <div class="selected-members" v-if="selectedMembers.length > 0">
                <Card class="no-hover" v-for="member in selectedMembers" :key="member.id">
                    <img src="/icons/Avatar.svg" alt="">
                    <span>{{ member.name }}</span>
                    <button class="icon" @click="removeMember(member)">
                        <img src="/icons/x.svg" alt="Удалить">
                    </button>
                </Card>
            </div>
            <div class="modal-buttons">
                <button class="transparent" @click="emit('cancel')">Отмена</button>
                <button class="blue" @click="add">{{ rightButtonText }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, inject, onMounted } from 'vue';
import { getUsers } from '@/api/modules/users.api';

import Card from '@/components/Card.vue';

const emit = defineEmits(['cancel', 'add']);

const props = defineProps({
    rightButtonText: String,
    members: {
        type: Array,
        reqiured: false
    }
})

const allUsers = ref([])
// const currentGroupMembers = inject('members');
// let currentGroupMembers = []
// if (props.rightButtonText === 'Добавить') { currentGroupMembers = inject('members') }

const nameInput = ref('');
const selectedMembers = ref([]);

const addMembers = inject('addMembers')

const availableUsers = computed(() => {
    if (!props.members || props.members.length === 0) return allUsers.value
    return allUsers.value.filter(user =>
        !props.members.some(member => member.id === user.id)
    );
});

const filteredMembers = computed(() => {
    if (!nameInput.value.trim()) return availableUsers.value;

    const query = nameInput.value.trim().toLowerCase();
    return availableUsers.value.filter(user =>
        user.name.toLowerCase().includes(query)
    );
});

const isSelected = (member) => {
    return selectedMembers.value.some(m => m.id === member.id);
};

const toggleMember = (member) => {
    const index = selectedMembers.value.findIndex(m => m.id === member.id);
    if (index === -1) {
        selectedMembers.value.push(member);
    } else {
        selectedMembers.value.splice(index, 1);
    }
};

const removeMember = (member) => {
    selectedMembers.value = selectedMembers.value.filter(m => m.id !== member.id);
};

const clearSearch = () => {
    nameInput.value = '';
};

const fetchUsers = async () => {
    allUsers.value = await getUsers()
    allUsers.value = allUsers.value.filter(u => u.id)
};

const add = () => {
    if (selectedMembers.value.length === 0) return;

    emit('add', selectedMembers.value); // Передаем выбранных пользователей
    selectedMembers.value = [];
};

onMounted(async () => {
    await fetchUsers()
})
</script>

<style scoped lang="scss">
.card:not(.selected-members .card) {
    position: relative;
    align-items: center;
    width: 100%;
    margin: 0;
    flex-direction: row;
    padding: 10px;
    border: 1px solid #513DEB;

    input {
        border: none;
    }
}

.dropdown {
    max-height: 100px;
}

.selected-members {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    max-height: 65px;
    overflow-x: auto;

    .card {
        flex-direction: row;
        align-items: center;
        gap: 7px;
        width: fit-content;
        padding: 10px;

        span {
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            letter-spacing: 0px;
            text-align: center;
            vertical-align: middle;
        }
    }
}

.modal-buttons {
    justify-content: space-around;
}
</style>