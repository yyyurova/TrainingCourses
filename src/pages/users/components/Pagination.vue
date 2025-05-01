<template>
    <div class="pagination">
        <button class="icon" @click="prevPage" :class="{ 'disable': currentPage === 1 }" :disabled="currentPage === 1">
            <img class=" arrow-left" src="/icons/arrow.svg" alt="">
        </button>

        <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
            :class="{ 'active': page === currentPage }">
            {{ page }}
        </button>

        <button class="icon" @click="nextPage" :class="{ 'disable': currentPage === totalPages }"
            :disabled="currentPage === totalPages">
            <img class=" arrow-right" src="/icons/arrow.svg" alt="">
        </button>
    </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue';

const props = defineProps({
    totalItems: Number,
    currentPage: Number
});

const emit = defineEmits(['update:currentPage']);

const nextPage = () => {
    if (props.currentPage < totalPages.value) {
        emit('update:currentPage', props.currentPage + 1);
    }
};

const prevPage = () => {
    if (props.currentPage > 1) {
        emit('update:currentPage', props.currentPage - 1);
    }
};

const goToPage = (page) => {
    emit('update:currentPage', page);
};

const totalPages = computed(() => {
    return Math.ceil(props.totalItems / 10);
});

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages.value, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});
</script>

<style scoped lang="scss">
.pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 10px 0;

    button {
        background-color: transparent;

        &:hover:not(.icon),
        &.active {
            background-color: #E9F2FF;
        }

        &.disable {
            pointer-events: none;
        }
    }
}
</style>