<script setup>
const emit = defineEmits(['filter']);

const statuses = [
    { value: 'approved', label: 'Доступ одобрен', color: '#007843' },
    { value: 'rejected', label: 'Доступ не одобрен', color: 'rgb(205, 50, 50)' },
    { value: 'pending', label: 'Новый пользователь', color: '#513DEB' }
];

const handleClick = (status) => {
    emit('filter', status);
};
</script>

<template>
    <div class="filter-modal">
        <div v-for="status in statuses" :key="status.value" @click="handleClick(status.value)">
            <p :style="`background-color:${status.color}`">{{ status.label }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.filter-modal div {
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background-color: #E9F2FF;
    }

    p {
        width: fit-content;
        border-radius: 4px;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0px;
        color: #F5F5F5;
        padding: 4px;
    }
}
</style>