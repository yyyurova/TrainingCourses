<template>
    <div class="modal">
        <div class="modal-content">
            <h2>Добавить ссылку</h2>
            <label for="link-input">Ссылка</label><br>
            <input v-model="link" type="text" autocomplete="off">
            <div class="modal-buttons">
                <button @click="cancel" class="transparent">Отмена</button>
                <button @click="add" class="blue">Добавить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const link = ref('')

const emit = defineEmits(['cancel', 'add'])

const cancel = () => {
    emit('cancel')
    link.value = ''
}

const add = () => {
    let correctedLink = link.value.trim();

    if (!correctedLink.startsWith('http://') && !correctedLink.startsWith('https://')) {
        correctedLink = 'https://' + correctedLink;
    }

    emit('add', correctedLink)
    link.value = ''
}
</script>

<style scoped lang="scss">
.modal-content {
    width: 400px !important;


    input {
        width: 100%;
        margin-top: 10px;
    }
}
</style>