<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Добавление практикантов</h2>

                <div class="dropdown">
                    <div v-for="user in allUsers" :key="user.id" class="item">
                        <input type="checkbox" :id="'user-' + user.id" :value="user" v-model="classroomMembers">
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

const members = inject('members')
const allUsers = ref([])

const classroomMembers = ref([]);

const fetchUsers = async () => {
    const data = await getUsers({ role: 'user', status: 'approved' })
    allUsers.value = data.data
    allUsers.value = allUsers.value.filter(user =>
        !members.value.some(member => member.id === user.id)
    );
}

const save = () => {
    emit('save',
        classroomMembers.value,
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