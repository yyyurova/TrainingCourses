<template>
    <div class="modal" @click.self="$emit('close')">
        <SVGPreview v-if="image.type === 'svg'" :content="image.svgContent" />

        <img v-else :src="image.path" :alt="image.name" class="modal-image">

        <button class="icon" @click="$emit('close')"><img src="/icons/x.svg" alt=""></button>
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

    button.icon {
        position: absolute;
        right: 30px;
        top: 30px;
    }
}
</style>