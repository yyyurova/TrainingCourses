<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Выберите роль пользователю</h2>
                <select v-model="selectedRole" id="selectRole">
                    <option value="" disabled selected hidden>Выберите роль</option>
                    <option value="admin">Администратор</option>
                    <option value="student">Студент</option>
                    <option value="teacher">Куратор</option>
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
    if (!selectedRole.value) return;
    emit('save', selectedRole.value);
    selectedRole.value = '';
};

const cancel = () => {
    selectedRole.value = '';
    emit('cancel');
};
</script>

<style scoped lang="scss">
.modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;


    .modal-content:not(.image) {
        max-height: 95vh;
        background-color: #fff;
        padding: 60px;
        border-radius: 8px;
        width: 530px;
        // width: fit-content;
        text-align: center;

        select {
            width: 100%;
            padding: 12px 16px;
            margin: 10px 0;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
            background-color: white;
            font-size: 16px;
            color: #333;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 16px;
            cursor: pointer;
            outline: none;
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        }
    }


}
</style>