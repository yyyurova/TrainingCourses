<template>
    <button class="transparent">
        Добавить участника
        <img src="/icons/plus.svg" alt="">
    </button>

    <Card class="no-hover">
        <img src="/icons/search.svg" alt="">
        <input autocomplete="off" type="text" placeholder="Поиск участников">
    </Card>
    <div class="members-in-group">
        222222
    </div>
</template>

<script setup>
import { inject } from 'vue';
import Card from '@/components/Card.vue';

const chat = inject('selectedChat')
</script>

<style scoped lang="scss">
button.transparent {
    border: 1px solid #513DEB;

}

.card {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;

    input {
        outline: none;
        border: none;
        padding: 0;
        border-radius: 0;
    }
}
</style>