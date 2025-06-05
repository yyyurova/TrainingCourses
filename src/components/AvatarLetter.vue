<template>
    <span class="avatar-letter">
        {{ name[0] }}
    </span>
</template>

<script setup>
defineProps({
    name: String
})
</script>

<style scoped lang="scss">
.avatar-letter {
    width: 35px;
    height: 35px;
    background-color: #513DEB;
    border-radius: 4px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
}
</style>