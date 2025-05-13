<template>
    <button class="blue">
        Добавить участника
        <img src="/icons/plus.svg" alt="">
    </button>

    <Card class="no-hover">
        <img src="/icons/search.svg" alt="">
        <input autocomplete="off" type="text" placeholder="Поиск участников">
    </Card>
    <div class="members-in-group">
        {{ chat.members.length }}
    </div>
</template>

<script setup>
import { inject } from 'vue';
import Card from '@/components/Card.vue';

const chat = inject('selectedChat')
</script>