<script setup>
const emit = defineEmits(['filter']);

const roles = [
    { value: 'teacher', label: 'Куратор', },
    { value: 'student', label: 'Студент', },
    { value: 'admin', label: 'Администратор', }
];

const handleClick = (role) => {
    emit('filter', role);
};
</script>

<template>
    <div class="filter-modal ">
        <div v-for="role in roles" :key="role.value" @click="handleClick(role.value)">
            <p>{{ role.label }}</p>
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
        padding: 4px;
    }
}
</style>