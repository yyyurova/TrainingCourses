<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Выберите роль пользователю</h2>
                <select v-model="selectedRole" id="selectRole">
                    <option value="" disabled selected hidden>Выберите роль</option>
                    <option value="admin">Администратор</option>
                    <option value="user">Студент</option>
                    <option value="curator">Куратор</option>
                </select>
                <div class="modal-buttons">
                    <button @click="cancel" class="transparent">Отмена</button>
                    <button @click="save" class="blue">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedRole = ref('')

const emit = defineEmits(['cancel', 'save'])

const save = () => {
    if (!selectedRole.value || selectedRole.value === '') {
        document.getElementById('selectRole').style.borderColor = 'red'
        return
    };
    emit('save', selectedRole.value);
    selectedRole.value = '';
};

const cancel = () => {
    selectedRole.value = '';
    emit('cancel');
};
</script>