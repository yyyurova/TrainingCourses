<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Вставить ссылку</h2>

                <div class="form-group">
                    <label>Адрес ссылки</label>
                    <input @keyup.enter="insertLink" v-model="linkUrl" type="url" autocomplete="off" required
                        placeholder="https://example.com">
                    <p class="error" v-if="error">{{ error }}</p>
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
const error = ref('');

const insertLink = () => {
    if (!linkUrl.value.trim()) {
        error.value = 'Введите ссылку';
        return;
    }

    emit('insert', linkUrl.value.trim());
    linkUrl.value = '';
    error.value = '';
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