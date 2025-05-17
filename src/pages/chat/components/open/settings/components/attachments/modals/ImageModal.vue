<template>
    <div class="modal" @click.self="$emit('close')">
        <SVGPreview v-if="image.type === 'svg'" :content="image.svgContent" />
        <img v-else :src="image.url" :alt="image.fileName" class="modal-image">
    </div>
</template>

<script setup>
import SVGPreview from '../SVGPreview.vue';

defineProps({
    image: {
        type: Object,
        required: true
    }
});

defineEmits(['close'])
</script>

<style scoped lang="scss">
.modal {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-image {
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
    }

    .svg-preview {
        max-width: 80%;
        max-height: 80%;
        object-fit: contain;
    }
}
</style>