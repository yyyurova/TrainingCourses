<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Вставить ссылку</h2>
                <div class="form-group">
                    <label>Адрес ссылки</label>
                    <input v-model="linkUrl" type="url" autocomplete="off" required placeholder="https://example.com">
                </div>
                <div class="form-group">
                    <label>Текст ссылки</label>
                    <input v-model="linkText" type="text" autocomplete="off" placeholder="Текст ссылки">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button type="button" class="blue" @click="insertLink" :disabled="!linkUrl">
                        Вставить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['cancel', 'insert']);

const linkUrl = ref('');
const linkText = ref('');

const insertLink = () => {
    if (!linkUrl.value.trim()) {
        console.warn("URL не может быть пустым");
        return;
    }
    emit('insert', {
        url: linkUrl.value.trim(),
        text: linkText.value.trim() || linkUrl.value.trim()
    });
};
</script>

<style scoped lang="scss">
.modal__inner {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>