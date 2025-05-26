<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Создать задание</h2>

                <div class="group">
                    <p for="taskTitle">Название<span class="required">*</span></p>
                    <input ref="taskName" type="text" autocomplete="off"
                        placeholder="Пример: Сделать дизайн интернет магазина">
                </div>

                <div class="group">
                    <p>Описание</p>
                    <TextEditorCard />
                </div>

                <div class="group">
                    <p>Для кого<span class="required">*</span></p>
                    <input type="text" :value="selectedUsers.map(u => u.name).join(', ')">
                    <div class="dropdown">
                        <div v-for="user in users" :key="user.id" class="item">
                            <input type="checkbox" :checked="isSelected(user)" @click="toggleMember(user)">
                            <img src="/icons/Avatar.svg" :alt="user.name">
                            <span>{{ user.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="group">
                    <p for="taskDeadline">Срок сдачи</p>
                    <input v-model="deadline" placeholder="Без срока сдачи" type="date">
                </div>

                <div class="modal-buttons">
                    <button class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button class="transparent" @click="$emit('draft')">Сохранить как черновик</button>
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

const create = () => {
    if (taskName.value.value.trim() === '') {
        taskName.value.style.border = '1px solid red'
        return
    }

    const assignedTo = selectedUsers.value.map(u => Number(u.id))

    const task = {
        title: taskName.value.value,
        description: description.value,
        deadline: (new Date(deadline.value).toISOString()),
        assignedTo: assignedTo
    }
    // console.log(members)
    emit('create', task)
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
};
</script>

<style scoped lang="scss">
.card {
    padding: 0;
    width: 100%;

    textarea {
        margin: 5px;
        border-radius: 8px;
        width: calc(100% - 10px);
        min-height: 50px;
    }
}

input {
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

    :deep(.editor-content) {
        min-height: 50px !important;
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
</style>