<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Добавление куратора</h2>

                <div class="dropdown" v-if="!isLoading && availableCurators.length > 0">
                    <div v-for="user in availableCurators" :key="user.id" class="item">
                        <input type="radio" :id="'user-' + user.id" :value="user" v-model="selectedCurator">
                        <label :for="'user-' + user.id">{{ user.name }}</label>
                    </div>
                </div>

                <div class="no-curators" v-if="!isLoading && availableCurators.length === 0">
                    <p>Нет доступных кураторов</p>
                </div>

                <Loading v-if="isLoading" />

                <div class="modal-buttons">
                    <button class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button class="blue" @click="save">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUsers } from '@/api/modules/adminUsers.api';

import Loading from '@/components/Loading.vue';

const emit = defineEmits(['cancel', 'save']);

const availableCurators = ref([])
const selectedCurator = ref(null)

const isLoading = ref(false)

const fetchUsers = async () => {
    try {
        isLoading.value = true
        const data = await getUsers({ role: 'curator', status: 'approved' })
        availableCurators.value = data.data
    } finally {
        isLoading.value = false
    }
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