<template>
    <div class="filter-modal" @click.stop="">
        <div>
            <div class="search-block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.9265 17.0401L20.3996 20.4001M19.2796 11.4401C19.2796 15.77 15.7695 19.2801 11.4396 19.2801C7.1097 19.2801 3.59961 15.77 3.59961 11.4401C3.59961 7.11019 7.1097 3.6001 11.4396 3.6001C15.7695 3.6001 19.2796 7.11019 19.2796 11.4401Z"
                        stroke="#292929" stroke-linecap="round" />
                </svg>
                <input @input="handleInput" v-model="nameInput" type="text"
                    placeholder="Начните вводить имя или фамилию">
            </div>
            <div class="dropdown">
                <div v-for="user in usersInDropdown" :key="user.id" class="item">
                    <input type="checkbox" :checked="isSelected(user)" @click="handleClick(user)">
                    <img src="/icons/Avatar.svg" :alt="user.name">
                    <span>{{ user.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, computed } from 'vue';

const emit = defineEmits(['filter'])

const nameInput = ref('')
const users = inject('users')
const selectedUsers = ref([])

const usersInDropdown = computed(() => {
    if (!nameInput.value) return users.value
    return users.value.filter(
        user => user.name.toLowerCase().includes(nameInput.value.toLowerCase())
    )
})

const handleClick = (user) => {
    const index = selectedUsers.value.findIndex(u => u.id === user.id)
    if (index === -1) {
        selectedUsers.value.push(user)
    } else {
        selectedUsers.value.splice(index, 1)
    }
    emit('filter', selectedUsers.value.map(u => u.name))
}

const isSelected = (user) => {
    return selectedUsers.value.some(u => u.id === user.id)
}
</script>

<style scoped lang="scss">
.filter-modal {
    width: 410px;
    padding: 10px;
}
</style>