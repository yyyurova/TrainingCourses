<template>
    <div class="no-users">
        <h2>Пользователи не найдены</h2>
        <button @click="resetFilters" class="blue">Сбросить все фильтры</button>
    </div>
</template>

<style scoped lang="scss">
.no-users {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
}
</style>

<script setup>
import { inject } from 'vue';

const resetFilters = inject('resetFilters')
</script>