<template>
    <div class="module" @click="toggleInfo">
        <div class="row">
            <p>Модуль {{ (moduleIndex + 1) + '. ' + module.title }}</p>

            <button class="icon">
                <img src="/icons/arrow.svg" :class="isOpen ? 'arrow-down' : 'arrow-right'" alt="">
            </button>
        </div>

        <div class="pages" v-if="isOpen && module.pages">
            <div class="page" v-for="page in module.pages" :key="page.id">
                <p class="title">Шаг {{ (module.pages.indexOf(page) + 1) + '. ' + page.title }}</p>

                <div v-if="page.questions.length > 0">
                    <div v-for="question in page.questions" :key="question.id" v-html="question.description"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false)

const props = defineProps({
    module: Object,
    moduleIndex: Number
});

const toggleInfo = () => {
    isOpen.value = !isOpen.value
}
</script>

<style scoped lang="scss">
.module {
    width: 100%;
    overflow: hidden;

    .row {
        cursor: pointer;
        padding: 15px;
        display: flex;
        gap: 10px;
        align-items: center;

        p {
            flex: 1;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
        }

        img {
            width: 36px;
            height: auto;
        }

        button {
            width: 32px;
            height: 32px;

            img {
                width: 100%;
                height: 100%;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
    }

    .pages {
        margin-left: 50px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        &.open {
            grid-template-rows: 1fr;
            padding: 0 15px 15px;
        }

        .page .title {
            font-weight: 600;
        }
    }
}
</style>