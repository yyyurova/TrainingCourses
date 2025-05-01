<template>
    <tr v-if="hasActiveFilters && users.length > 0">
        <td colspan="7">
            <div class="filters-row">
                <div v-auto-animate class="filters">
                    <Card v-if="filters.role">
                        <span>Роль</span>
                        <button class="icon" @click="removeFilter('role')">
                            <svg class="delete" width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 9L9 23M9.00001 9L23 23" stroke="#292929" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </Card>
                    <Card v-if="filters.status">
                        <span>Статус</span>
                        <button class="icon" @click="removeFilter('status')">
                            <svg class="delete" width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 9L9 23M9.00001 9L23 23" stroke="#292929" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </Card>
                    <Card v-if="filters.email">
                        <span>Email</span>
                        <button class="icon" @click="removeFilter('email')">
                            <svg class="delete" width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 9L9 23M9.00001 9L23 23" stroke="#292929" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </Card>
                    <Card class="card" v-if="filters.name">
                        <span>Имя</span>
                        <button class="icon" @click="removeFilter('name')">
                            <svg class="delete" width="32" height="32" viewBox="0 0 32 32" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 9L9 23M9.00001 9L23 23" stroke="#292929" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </Card>
                </div>
                <button class="blue" @click="resetFilters">Сбросить все фильтры</button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { computed, inject } from 'vue';

import Card from '@/components/Card.vue';

const filters = inject('filters')

const hasActiveFilters = computed(() => {
    return filters.value.role || filters.value.status || filters.value.email || filters.value.name;
});

const removeFilter = (type) => {
    filters.value[type] = null;
};

// const resetFilters = () => {
//     filters.value.role = null;
//     filters.value.status = null;
//     filters.value.email = null;
//     filters.value.name = null;

//     // Эмитим событие для сброса в дочерних компонентах
//     // emit('reset-filters');
// };
const resetFilters = inject('resetFilters')

const users = inject('users')
</script>

<style scoped lang="scss">
.filters-row {
    display: flex;
    gap: 10px;
    padding: 10px;

    .filters {
        display: flex;
        gap: 10px;

        .card {
            width: fit-content;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: 1px solid #513DEB;
            margin: 0;
            max-height: 48px;
            border-radius: 8px;
        }
    }
}
</style>