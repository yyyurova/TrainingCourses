<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Редактировать пользователя</h2>

                <form>
                    <label for="userName">Имя и Фамилия<span class="required">*</span></label>
                    <input v-model="form.name" type="text" autocomplete="off" id="userName">

                    <label for="email">Электронная почта<span class="required">*</span></label>
                    <input v-model="form.email" type="text" autocomplete="off" id="userEmail">

                    <p>Роль<span class="required">*</span></p>
                    <select v-model="form.role" id="userRole">
                        <option value="" disabled selected hidden>Выберите роль</option>
                        <option value="admin">Администратор</option>
                        <option value="student">Студент</option>
                        <option value="teacher">Преподаватель</option>
                    </select>

                    <p>Статус<span class="required">*</span></p>
                    <select v-model="form.status" id="userStatus">
                        <option value="approved">Доступ одобрен</option>
                        <option value="disapproved">Доступ не одобрен</option>
                        <option value="new user">Новый пользователь</option>
                    </select>

                    <div class="modal-buttons">
                        <button type="button" class="transparent" @click="cancel">Отмена</button>
                        <button type="button" class="blue" @click="save">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

// const showPopup = ref(false)

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['cancel', 'edit']);

const form = ref({
    name: '',
    email: '',
    role: '',
    status: ''
});

const validate = () => {
    let isValid = true;

    if (!form.value.name.trim()) {
        document.getElementById('userName').style.borderColor = 'red';
        isValid = false;
    } else {
        document.getElementById('userName').style.borderColor = '#E0E0E0';
    }

    if (!form.value.email.trim()) {
        document.getElementById('userEmail').style.borderColor = 'red';
        isValid = false;
    } else {
        document.getElementById('userEmail').style.borderColor = '#E0E0E0';
    }

    if (!form.value.role) {
        document.getElementById('userRole').style.borderColor = 'red';
        isValid = false;
    } else {
        document.getElementById('userRole').style.borderColor = '#E0E0E0';
    }

    return isValid;
};

const save = () => {
    if (validate()) {
        emit('edit', form.value);
        // showPopup.value = true
    }
};

const cancel = () => {
    emit('cancel');
};

watch(() => props.user, (newVal) => {
    if (newVal) {
        form.value = {
            name: newVal.name,
            email: newVal.email,
            role: newVal.role || '',
            status: newVal.status || 'new user'
        };
    }
}, { immediate: true });
</script>

<style scoped lang="scss">
form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>