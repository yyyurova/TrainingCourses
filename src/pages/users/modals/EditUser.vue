<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Редактировать пользователя</h2>

                <form>
                    <label for="userName">Имя и Фамилия<span class="required">*</span></label>
                    <input :class="{ 'error': error.name }" v-model="form.name" type="text" autocomplete="off"
                        id="userName">

                    <label for="email">Электронная почта<span class="required">*</span></label>
                    <input :class="{ 'error': error.email }" v-model="form.email" type="text" autocomplete="off"
                        id="userEmail">

                    <p>Роль<span class="required">*</span></p>
                    <select :class="{ 'error': error.role }" v-model="form.role" id="userRole">
                        <option value="" disabled selected hidden>Выберите роль</option>
                        <option value="admin">Администратор</option>
                        <option value="user">Студент</option>
                        <option value="curator">Преподаватель</option>
                    </select>

                    <p>Статус<span class="required">*</span></p>
                    <select :class="{ 'error': error.status }" v-model="form.status" id="userStatus">
                        <option value="approved">Доступ одобрен</option>
                        <option value="rejected">Доступ не одобрен</option>
                        <option value="pending">Новый пользователь</option>
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

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['cancel', 'edit']);

const error = ref({
    name: false,
    email: false,
    role: false,
    status: false
})

const form = ref({
    name: '',
    email: '',
    role: '',
    status: '',
});

const validate = () => {
    let isValid = true;

    if (!form.value.name.trim()) {
        error.value.name = true
        isValid = false;
    }

    if (!form.value.email.trim()) {
        error.value.email = true
        isValid = false;
    }

    if (!form.value.role) {
        error.value.role = true
        isValid = false;
    }

    if (!form.value.status) {
        error.value.status = true
        isValid = false;
    }

    return isValid;
};

const save = () => {
    if (validate()) {
        emit('edit', form.value);
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
            role: newVal.role || 'student',
            status: newVal.status || 'pending'
        };
    }
}, { immediate: true });
</script>

<style scoped lang="scss">
form {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .error {
        border: 1px solid red !important;
    }
}
</style>