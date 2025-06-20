<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Добавление практикантов и куратора</h2>

                <div class="form-group">
                    <p>Куратор<span class="required">*</span></p>

                    <div class="dropdown">
                        <div v-for="user in curators" :key="user.id" class="item">
                            <input type="radio" :id="'user-' + user.id" :value="user" v-model="selectedCurator">
                            <label :for="'user-' + user.id">{{ user.name }}</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <p>Участники</p>

                    <div class="dropdown">
                        <div v-for="user in students" :key="user.id" class="item">
                            <input type="checkbox" :id="'user-' + user.id" :value="user" v-model="classroomMembers">
                            <label :for="'user-' + user.id">{{ user.name }}</label>
                        </div>
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
import { ref, onMounted } from 'vue';
import { getUsers } from '@/api/modules/adminUsers';

const emit = defineEmits(['cancel', 'save']);

const students = ref([])
const curators = ref([])

const classroomMembers = ref([]);
const selectedCurator = ref(null);

const fetchUsers = async () => {
    try {
        students.value = (await getUsers({ role: 'user', status: 'approved' })).data
        curators.value = (await getUsers({ role: 'curator', status: 'approved' })).data
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }
};

const save = () => {
    emit('save', {
        members: classroomMembers.value,
        curator_id: selectedCurator.value.id
    });
};

onMounted(async () => {
    await fetchUsers();
});
</script>

<style scoped lang="scss">
.card {
    width: 100%;

    img {
        width: 100%;
        height: auto;
        max-height: 200px;
        object-fit: cover;
    }

    button {
        border: 1px solid #513DEB;
    }
}

.form-group {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 7px;

    .dropdown {
        max-height: 100px;
    }
}
</style>