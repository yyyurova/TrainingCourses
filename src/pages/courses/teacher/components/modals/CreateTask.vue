<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Создать задание</h2>

                <div class="group">
                    <p for="taskTitle">Название<span class="required">*</span></p>
                    <input ref="taskName" type="text" autocomplete="off"
                        placeholder="Пример: Сделать дизайн интернет магазина" :class="{ 'error': errors.name }"
                        @input="errors.name = false">
                    <span v-if="errors.name" class="error-message">Поле обязательно для заполнения</span>
                </div>

                <div class="group">
                    <p>Описание<span class="required">*</span></p>
                    <TextEditorCard v-model="description" :class="{ 'error': errors.description }"
                        @input="errors.description = false" />
                    <span v-if="errors.description" class="error-message">Поле обязательно для заполнения</span>
                </div>

                <div class="group">
                    <p>Для кого<span class="required">*</span></p>
                    <input type="text" :value="selectedUsers.map(u => u.name).join(', ')"
                        :class="{ 'error': errors.users }" @click="errors.users = false" readonly>
                    <div class="dropdown">
                        <div v-for="user in users" :key="user.id" class="item" @click="toggleMember(user)">
                            <input type="checkbox" :checked="isSelected(user)" @click.stop="toggleMember(user)">
                            <img :src="user.avatar || '/icons/Avatar.svg'" :alt="user.name">
                            <span>{{ user.name }}</span>
                        </div>
                    </div>
                    <span v-if="errors.users" class="error-message">Необходимо выбрать хотя бы одного
                        пользователя</span>
                </div>

                <div class="group">
                    <p for="taskDeadline">Срок сдачи<span class="required">*</span></p>
                    <input v-model="deadline" placeholder="Без срока сдачи" type="date"
                        :class="{ 'error': errors.deadline }" @change="errors.deadline = false">
                    <span v-if="errors.deadline" class="error-message">Укажите срок сдачи</span>
                </div>

                <div class="modal-buttons">
                    <button class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button class="transparent" @click="saveAsDraft">Сохранить как черновик</button>
                    <button class="blue" @click="create">Создать</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TextEditorCard from '@/components/TextEditorCard.vue';

const emit = defineEmits(['cancel', 'draft', 'create'])
defineProps({
    users: Array
})

const taskName = ref(null)
const description = ref('')
const deadline = ref(null)
const selectedUsers = ref([])

const errors = ref({
    name: false,
    description: false,
    users: false,
    deadline: false
})

const validate = () => {
    let isValid = true;

    errors.value = {
        name: taskName.value.value.trim() === '',
        description: description.value.trim() === '',
        users: selectedUsers.value.length === 0,
        deadline: !deadline.value
    };

    return !Object.values(errors.value).some(error => error);
};

const create = () => {
    if (!validate()) {
        return;
    }

    const assignedTo = selectedUsers.value.map(u => Number(u.id))

    const task = {
        name: taskName.value.value,
        text: description.value,
        until: (new Date(deadline.value).toISOString()),
        users: assignedTo
    }
    emit('create', task)
}

const saveAsDraft = () => {
    // Для черновика проверка не обязательна
    const assignedTo = selectedUsers.value.map(u => Number(u.id))

    const task = {
        name: taskName.value.value,
        text: description.value,
        until: deadline.value ? (new Date(deadline.value).toISOString()) : null,
        users: assignedTo
    }
    emit('draft', task)
}

const isSelected = (user) => {
    return selectedUsers.value.some(u => u.id === user.id);
};

const toggleMember = (user) => {
    const index = selectedUsers.value.findIndex(u => u.id === user.id);
    if (index === -1) {
        selectedUsers.value.push(user);
    } else {
        selectedUsers.value.splice(index, 1);
    }
    errors.value.users = false;
};
</script>

<style scoped lang="scss">
.modal-content {
    width: 550px !important;

    .card {
        padding: 0;
        width: 100%;
    }

    :deep(.ql-formats) {
        gap: 5px !important;

        .ql-image {
            width: 28px;
            height: 28px;
        }
    }

    input:not(input[type="checkbox"]) {
        width: 100%;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;

        :deep(.format-toolbar) {
            padding: 0 !important;
            gap: 10px !important;
        }

        .dropdown {
            max-height: 100px;
        }
    }

    .icons {
        padding: 10px;
        border-top: 1px solid #d9d9d9;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;

        button {
            padding: 7px;

            img {
                width: 20px;
                height: auto;
            }

            &:hover {
                background-color: #E9F2FF;
            }
        }
    }
}

.error {
    border: 1px solid red !important;
}

.error-message {
    color: red;
    font-size: 12px;
    margin-top: -5px;
}
</style>