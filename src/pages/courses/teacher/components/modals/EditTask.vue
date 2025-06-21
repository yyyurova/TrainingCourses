<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Редактировать задание</h2>

                <div class="group">
                    <p>Название<span class="required">*</span></p>
                    <input v-model="task.name" type="text" autocomplete="off">
                </div>

                <div class="group">
                    <p>Описание</p>
                    <TextEditorCard v-model="task.text" />
                </div>

                <div class="group">
                    <p>Срок сдачи</p>
                    <input v-model="deadlineFormatted" type="date">
                </div>

                <div class="modal-buttons">
                    <button class="transparent" @click="$emit('cancel')">Отмена</button>
                    <button class="blue" @click="save">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import TextEditorCard from '@/components/TextEditorCard.vue';

const props = defineProps({
    task: Object
});

const emit = defineEmits(['cancel', 'save']);

const deadlineFormatted = computed({
    get: () => props.task.until ? new Date(props.task.until).toISOString().split('T')[0] : '',
    set: (value) => {
        props.task.until = value ? `${value}T00:00:00.000Z` : null;
    }
});

const save = () => {
    emit('save', props.task);
};
</script>

<style scoped lang="scss">
textarea {
    padding: 10px;
    border-radius: 8px;
    width: 100%;
    min-height: 42px;
    border: 1px solid #D9D9D9;
}

input {
    width: 100%;
}

.group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}
</style>