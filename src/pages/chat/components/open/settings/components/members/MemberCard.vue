<template>
    <div class="group-member-row">
        <img v-if="member.avatar" :src="member.avatar">
        <AvatarLetter v-else :name="member.name" />
        <p>{{ member.name }}</p>
        <button class="icon" @click="$emit('delete', member)">
            <img src="/icons/delete.svg" alt="">
        </button>
    </div>
</template>

<script setup>
import AvatarLetter from '@/components/AvatarLetter.vue';

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
    gap: 10px;

    img {
        width: 36px;
        height: fit-content;
    }

    p {
        flex: 1;
        word-break: break-all;
    }
}
</style>