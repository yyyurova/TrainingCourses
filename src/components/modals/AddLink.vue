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
                    <input v-model="linkText" type="text" autocomplete="off" required placeholder="Текст ссылки">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button type="button" class="blue">Вставить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['cancel'])

const linkUrl = ref('')
const linkText = ref('')
</script>