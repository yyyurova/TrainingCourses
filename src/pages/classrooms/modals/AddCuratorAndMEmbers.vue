<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Добавление практикантов и куратора</h2>

                <div class="form-group">
                    <p>Куратор<span class="required">*</span></p>
                    <select v-model="selectedCurator">
                        <option v-for="user in curators" :key="user.id" :value="user">
                            {{ user.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <p>Участники</p>

                    <div class="dropdown">
                        <div v-for="user in students" :key="user.id" class="item">
                            <input type="checkbox" :id="'user-' + user.id" :value="user" v-model="classroomMembers">
                            <label :for="'user-' + user.id">{{ user.name }}</label>
                        </div>
                    </div>
                    <!-- <div class="users-list">
                        <div v-for="user in students" :key="user.id" class="user-item">
                            <input type="checkbox" :id="'user-' + user.id" :value="user" v-model="classroomMembers">
                            <label :for="'user-' + user.id">{{ user.name }}</label>
                        </div>
                    </div> -->
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
import { getUsers } from '@/api/modules/adminUsers.api';

const emit = defineEmits(['cancel', 'save']);

const users = ref([]);
const students = ref([])
const curators = ref([])

const classroomMembers = ref([]);
const selectedCurator = ref(null);

const fetchUsers = async () => {
    try {
        users.value = (await getUsers()).data;
        students.value = users.value.filter(u => u.role === 'user')
        curators.value = users.value.filter(u => u.role === 'curator')
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }
};

const save = () => {
    // Добавляем куратора в список участников
    if (selectedCurator.value) {
        classroomMembers.value.push(selectedCurator.value);
    }
    console.log(classroomMembers.value)
    emit('save', {
        members: classroomMembers.value,
        curator_id: selectedCurator.value.id
    });
};

onMounted(async () => {
    await fetchUsers();

    console.log(users.value)
    console.log(students.value)
    console.log(curators.value)

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