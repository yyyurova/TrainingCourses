<template>
    <div class="module">
        <Card class="no-hover">
            <h3 class="number">{{ num }}.</h3>
            <div class="input-container">
                <input @blur="checkEmptyness" type="text" class="name" :value="mod.name"
                    @input="$emit('update:name', $event.target.value)">
                <p v-if="warning !== ''">{{ warning }}</p>
            </div>

            <div class="action-buttons">
                <button v-if="mod.pages && mod.pages.length > 0" class="icon"
                    @click="isPagesListOpen = !isPagesListOpen">
                    <img :class="isPagesListOpen ? 'arrow-down' : 'arrow-up'" src="/icons/arrow.svg" alt="">
                </button>
                <button class="icon" @click="$emit('delete-module')">
                    <img src="/icons/x.svg" alt="">
                </button>
            </div>
        </Card>
        <p v-if="mod.noPages" class="no-pages">Добавьте хотя бы одну страницу в модуль</p>
        <Transition>
            <div class="pages" v-if="mod.pages && mod.pages.length && isPagesListOpen">
                <Page v-for="(page, pageIndex) in mod.pages" :key="pageIndex" :page="page" :module-index="moduleIndex"
                    :page-index="pageIndex" @update:name="emit('update-page-name', moduleIndex, pageIndex, $event)" />
            </div>
        </Transition>

        <button class="blue new-page" @click="addPage">
            Новая страница
            <img src="/icons/plus.svg" alt="">
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import Card from '@/components/Card.vue';
import Page from './Page.vue';

const isPagesListOpen = ref(false);
const warning = ref('');

const props = defineProps({
    num: Number,
    mod: Object,
    moduleIndex: Number
});

const emit = defineEmits([
    'update:name',
    'delete-module',
    'add-page',
    'update-page-name'
]);

const addPage = () => {
    // if (props.mod.pages.length > 0) { isPagesListOpen.value = true }
    emit('add-page', props.mod.id);
    isPagesListOpen.value = true
};

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
.module {
    display: flex;
    flex-direction: column;
    gap: 10px;

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

    .no-pages {
        margin-left: 50px;
        color: red;
    }

    .pages {
        margin-left: 50px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    button.new-page {
        margin-left: 50px;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}

@media (max-width: 960px) {
    input.name {
        width: 100% !important;
    }
}
</style>