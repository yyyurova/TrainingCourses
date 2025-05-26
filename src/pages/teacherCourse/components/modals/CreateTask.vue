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
                    <p for="taskDescription">Описание</p>
                    <Card class="no-hover">
                        <!-- <div contenteditable="true"></div> -->
                        <textarea v-model="description" autocomplete="off"></textarea>
                        <div class="icons">
                            <button class="icon">
                                <img src="/icons/paperclip.svg" alt="">
                            </button>

                            <button class="icon">
                                <img src="/icons/bold.svg" alt="">
                            </button>
                            <button class="icon" data-style="underline">
                                <img src="/icons/underline.svg" alt="">
                            </button>
                            <button class="icon" data-style="italic">
                                <img src="/icons/italics.svg" alt="">
                            </button>
                            <button class="icon" data-style="code">
                                <img src="/icons/code.svg" alt="">
                            </button>
                        </div>
                    </Card>
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

import Card from '@/components/Card.vue';

const emit = defineEmits(['cancel', 'draft', 'create'])

const taskName = ref(null)
const description = ref('')
const deadline = ref(null)

const create = () => {
    if (taskName.value.value.trim() === '') {
        taskName.value.style.border = '1px solid red'
        return
    }
    const task = {
        title: taskName.value.value,
        description: description.value,
        deadline: (new Date(deadline.value).toISOString())
    }

    emit('create', task)
}
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