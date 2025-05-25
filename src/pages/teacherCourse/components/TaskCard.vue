<template>
    <Card class="task">
        <img src="/icons/list-right.svg" alt="">
        <div class="text">
            <p class="name">{{ task.title }}</p>
            <p class="deadline" :class="{ 'overdue': checkOverdueDeadline(task.deadline) }">{{
                format(task.deadline, 'short') }}</p>
        </div>
        <div class="action-buttons">
            <button class="icon" @click="editTask">
                <img src="/icons/pen.svg" alt="">
            </button>
            <button class="icon" @click="deleteTask">
                <img src="/icons/delete.svg" alt="">
            </button>
        </div>
    </Card>
</template>

<script setup>
import { format } from '@formkit/tempo';
import { checkOverdueDeadline } from '@/utils/utils';

import Card from '@/components/Card.vue';

const props = defineProps({
    task: Object,
})
const emit = defineEmits(['delete', 'edit'])

const deleteTask = () => {
    emit('delete')
}

const editTask = () => {
    emit('edit')
}


</script>

<style scoped lang="scss">
.card.task {
    cursor: pointer;
    width: calc(33% - 5px);
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;

    .text {
        flex: 1;
        max-width: 73%;
        display: flex;
        flex-direction: column;
        gap: 7px;

        p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}

@media (max-width: 1280px) {
    .card.task {
        width: calc(50% - 5px) !important;
    }
}
</style>