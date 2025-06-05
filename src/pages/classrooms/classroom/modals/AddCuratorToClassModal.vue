<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Добавление куратора</h2>

                <div class="dropdown">
                    <div v-for="user in availableCurators" :key="user.id" class="item">
                        <input type="radio" :id="'user-' + user.id" :value="user" v-model="selectedCurator">
                        <label :for="'user-' + user.id">{{ user.name }}</label>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button class="blue" @click="save">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { getUsers } from '@/api/modules/adminUsers.api';

const emit = defineEmits(['cancel', 'save']);

const availableCurators = ref([])
const selectedCurator = ref(null)

const fetchUsers = async () => {
    const data = await getUsers({ role: 'curator' })
    availableCurators.value = data.data
    availableCurators.value = availableCurators.value.filter(u => u.role === 'curator')
}

const save = () => {
    emit('save',
        selectedCurator.value.id,
    );
};

onMounted(async () => {
    await fetchUsers();
});
</script>

<style scoped lang="scss">
.dropdown {
    max-height: 100px;
}
</style>