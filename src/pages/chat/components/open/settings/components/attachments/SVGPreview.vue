<template>
    <div class="svg-preview" v-html="content" />
</template>

<script setup>
defineProps({
    content: {
        type: String,
        required: true
    }
});
</script>

<style scoped lang="scss">
.svg-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
    }
}
</style>