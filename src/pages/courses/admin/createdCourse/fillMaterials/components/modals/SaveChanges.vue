<template>
    <div class="modal">
        <div class="modal-content">
            <h2>Сохранить изменения?</h2>
            <p>Вы отредактировали урок, но не сохранили его</p>
            <div class="modal-buttons">
                <button class="transparent" @click="$emit('cancel')">Отмена</button>
                <button class="blue" @click="$emit('confirm')">Сохранить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['cancel', 'confirm'])
</script>

<style scoped lang="scss">
.modal-buttons {
    flex-wrap: wrap;
    gap: 10px;

    button.discard {
        width: 100%;
    }
}
</style>