<template>
    <Card v-if="page" class="no-hover">
        <h3 class="number">{{ (moduleIndex + 1) + '.' + (pageIndex + 1) }}</h3>

        <div class="input-container">
            <input type="text" class="name" :value="page.title" @input="$emit('update:name', $event.target.value)"
                @blur="checkEmptyness">
            <p v-if="warning !== ''">{{ warning }}</p>
        </div>

        <div class="action-buttons">
            <button class="icon" @click="deletePage(moduleIndex, pageIndex)">
                <img src="/icons/x.svg" alt="">
            </button>
        </div>
    </Card>
</template>

<script setup>
import { ref, inject } from 'vue';
import Card from '@/components/Card.vue';

const warning = ref('');

const props = defineProps({
    page: Object,
    moduleIndex: Number,
    pageIndex: Number
});

const emit = defineEmits(['update:name']);

const deletePage = inject('deletePage');

const checkEmptyness = (e) => {
    if (e.target.value.trim() === '') {
        e.target.style.border = '1px solid red';
        warning.value = 'Это поле нельзя оставлять пустым';
    } else {
        e.target.style.border = '1px solid transparent';
        warning.value = '';
    }
};
</script>

<style scoped lang="scss">
.card {
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
            width: 50%;
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