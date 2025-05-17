<template>
    <div class="group-member-row">
        <img src="/avatar.png">
        <p>{{ member.name }}</p>
        <button class="icon" @click="$emit('delete', member)">
            <img src="/icons/delete.svg" alt="">
        </button>
    </div>
</template>

<script setup>
defineProps({
    member: Object
})

const emit = defineEmits(['delete'])
</script>

<style scoped lang="scss">
.group-member-row {
    display: flex;
    width: 100%;
    align-items: center;
    max-height: 40px;

    img {
        width: 36px;
        height: fit-content;
    }

    p {
        flex: 1;
    }
}
</style>