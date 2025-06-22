<template>
    <Card class="no-hover answer">
        <input :type="inputType === 'several' ? 'checkbox' : 'radio'" @click="handleCorrect" :checked="isCorrect">
        <div class="input-container">
            <input v-model="optionText" @blur="checkEmptyness" type="text" class="name">
            <p v-if="warning !== ''">{{ warning }}</p>
        </div>

        <div class="action-buttons" @click="$emit('remove', index)">
            <button class="icon">
                <img src="/icons/actions/x.svg" alt="">
            </button>
        </div>
    </Card>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

import Card from '@/components/Card.vue';

const props = defineProps({
    inputType: String,
    option: String,
    index: Number,
    isCorrect: Boolean
});

const emit = defineEmits(['remove', 'update:option']);

const optionText = ref(props.option);
const warning = ref('');

watch(optionText, (newVal) => {
    emit('update:option', newVal);
});

const checkEmptyness = () => {
    if (optionText.value.trim() === '') {
        warning.value = 'Это поле нельзя оставлять пустым';
    } else {
        warning.value = '';
    }
};

const handleCorrect = (e) => {
    emit('update:correct', {
        index: props.index,
        isChecked: e.target.checked
    });
};
</script>

<style scoped lang="scss">
.card.answer {
    padding: 10px 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    .number {
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        letter-spacing: 1px;
    }

    .name {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0px;
        border: 1px solid transparent;
        outline: none;

        &:focus {
            border: 1px solid #513DEB !important;
        }
    }

    .input-container {
        flex: 1;

        input {
            width: 100%;
        }

        p {
            color: red;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
        }
    }
}
</style>