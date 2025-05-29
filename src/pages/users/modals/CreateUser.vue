<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Создать пользователя</h2>

                <form>
                    <label for="userName">Имя и Фамилия<span class="required">*</span></label>
                    <input v-model="userName" type="text" autocomplete="off" id="userName">

                    <label for="email">Электронная почта<span class="required">*</span></label>
                    <input v-model="userEmail" type="text" autocomplete="off" id="userEmail">

                    <p>Роль<span class="required">*</span></p>
                    <select v-model="userRole" id="userRole">
                        <option value="" disabled selected hidden>Выберите роль</option>
                        <option value="admin">Администратор</option>
                        <option value="user">Студент</option>
                        <option value="curator">Куратор</option>
                    </select>

                    <p>Статус<span class="required">*</span></p>
                    <select v-model="userStatus" id="userStatus">
                        <option value="" disabled selected hidden>Выберите статус</option>
                        <option value="pending">Новый пользователь</option>
                        <option value="approved">Доступ одобрен</option>
                        <option value="rejected">Доступ не одобрен</option>
                    </select>

                    <div class="modal-buttons">
                        <button type="button" class="transparent" @click="cancel">Отмена</button>
                        <button type="button" class="blue" @click="create">Создать</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['cancel', 'create'])

const userEmail = ref('')
const userName = ref('')
const userRole = ref('')
const userStatus = ref('')

const create = () => {
    if (userEmail.value.trim() === '') {
        document.getElementById('userEmail').style.borderColor = 'red'
    } else {
        document.getElementById('userEmail').style.borderColor = '#E0E0E0'
    }

    if (userName.value.trim() === '') {
        document.getElementById('userName').style.borderColor = 'red'
    } else {
        document.getElementById('userName').style.borderColor = '#E0E0E0'
    }

    if (userRole.value.trim() === '') {
        document.getElementById('userRole').style.borderColor = 'red'
    } else {
        document.getElementById('userRole').style.borderColor = '#E0E0E0'
    }

    if (userStatus.value.trim() === '') {
        document.getElementById('userStatus').style.borderColor = 'red'
    } else {
        document.getElementById('userStatus').style.borderColor = '#E0E0E0'
    }

    if (userEmail.value && userName.value && userRole.value && userStatus.value) {
        const user = {
            name: userName.value,
            email: userEmail.value,
            role: userRole.value,
            status: userStatus.value,
        }
        emit('create', user)
        userEmail.value = ''
        userRole.value = ''
        userName.value = ''
        userStatus.value = ''
    }
}
const cancel = () => {
    userEmail.value = ''
    userRole.value = ''
    userName.value = ''
    userStatus.value = ''
    emit('cancel')
}
</script>