<template>
    <Card class="full-task no-hover">
        <h2>Задание</h2>
        <p v-if="task.mark" class="mark">Оценка: {{ task.mark }}</p>
        <p class="deadline">Срок сдачи: {{ format(task.until, 'short') }}</p>
        <p class="name">{{ task.name }}</p>
        <p class="content-of-task" v-html="task.text"></p>
    </Card>
</template>

<script setup>
import { inject } from 'vue';
import { format } from '@formkit/tempo';

import Card from '@/components/Card.vue';

const task = inject('task')
</script>

<style scoped lang="scss">
.full-task .mark {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0px;
    padding: 0;
    color: #292929;
}

.deadline {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0px;
    color: #787878;
}

.name {
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 1px;
    margin-bottom: 10px;
}
</style>