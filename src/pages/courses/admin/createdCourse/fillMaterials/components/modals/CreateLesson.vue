<template>
    <div class="modal">
        <div class="modal-content">
            <h2>Созданиe шага</h2>
            <div class="radio-inputs">
                <label class="radio">
                    <input type="radio" name="radio" v-model="selectedType" value="text">
                    <span class="name">
                        Текст
                        <img src="/icons/type-text.svg" alt="">
                    </span>
                </label>
                <label class="radio">
                    <input type="radio" name="radio" v-model="selectedType" value="video">
                    <span class="name">
                        Видео
                        <img src="/icons/type-video.svg" alt="">
                    </span>
                </label>
                <label class="radio">
                    <input type="radio" name="radio" v-model="selectedType" value="quiz">
                    <span class="name">
                        Тест
                        <img src="/icons/type-quiz.svg" alt="">
                    </span>
                </label>
            </div>
            <div class="modal-buttons">
                <button class="transparent" @click="$emit('cancel')">Отмена</button>
                <button class="blue" @click="handleCreate">Создать шаг</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedType = ref('text');
const emit = defineEmits(['cancel', 'create']);

const getTypeNumber = (type) => {
    let num
    switch (type) {
        case 'text':
            num = 1
            break
        case 'video':
            num = 2
            break
        case 'quiz':
            num = 3
            break
    }
    return num
}

const handleCreate = () => {
    emit('create', getTypeNumber(selectedType.value));
    selectedType.value = 'text';
};
</script>

<style scoped lang="scss">
.modal-content {
    .radio-inputs {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        border-radius: 8px;
        background-color: #fff;
        box-sizing: border-box;
        border: 1px solid #D9D9D9;
        width: 100%;
        font-size: 14px;

        .radio {
            flex: 1 1 auto;
            text-align: center;

            input {
                display: none;

                &:checked+.name {
                    background-color: #E9F2FF;
                }
            }
        }

        .name {
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            gap: 7px;
            border-radius: 8px;
            border: none;
            padding: 10px 0;
            color: #292929;
            transition: all .15s ease-in-out;
        }
    }
}
</style>