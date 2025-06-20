<template>
    <Card class="no-hover">
        <img src="/icons/file.svg" alt="">

        <div class="file-info">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-size">{{ file.size }}</p>
        </div>

        <button class="icon" @click="handleDelete">
            <img src="/icons/x.svg" alt="">
        </button>
    </Card>
</template>

<script setup>
import Card from '@/components/Card.vue'

const props = defineProps({
    file: Object
})

const emit = defineEmits(['deleteFile'])

const handleDelete = () => {
    emit('deleteFile', props.file)
}
</script>

<style scoped lang="scss">
.card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    flex-shrink: 0;
    max-width: 45%;
    width: fit-content;
    white-space: normal;

    .file-info {
        max-width: 65%;

        .file-name {
            font-weight: 500;
            color: #292929;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        .file-size {
            font-size: 12px;
            color: #7D7D7D;
        }
    }

    button img {
        width: 20px;
    }
}
</style>