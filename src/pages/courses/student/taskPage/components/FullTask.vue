<template>
    <Card class="full-task no-hover">
        <h2>Задание</h2>
        <p class="mark">Оценка: {{ task.mark }}</p>
        <p class="deadline">Срок сдачи: {{ format(task.deadline, 'short') }}</p>
        <p class="name">{{ task.title }}</p>
        <p class="content-of-task">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            aut cum neque at cumque consequatur mollitia sed recusandae nemo est tempore ex
            veritatis, consectetur autem quae consequuntur enim doloremque? Magni labore earum
            expedita doloremque sint, nemo vel ab temporibus. Dolorem ea quisquam saepe. Similique
            labore temporibus, fugiat vitae sint maxime.</p>
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
    margin-bottom: 20px;
}

.name {
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 1px;
    margin-bottom: 10px;
}
</style>