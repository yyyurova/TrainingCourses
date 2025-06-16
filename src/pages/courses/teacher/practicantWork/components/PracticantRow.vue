<template>
    <div class="practicant-row">
        <img v-if="practicant.avatar" class="avatar" :src="practicant.avatar" alt="">
        <AvatarLetter v-else :name="practicant.name" />
        <span>{{ practicant.name }}</span>
        <input min="1" max="10" :disabled="action === 'Назначить' || selectedPracticant?.id !== practicant.id"
            v-model="localMark" class="mark" type="number" @input="handleInput">
        <button class="icon" @click.stop="showAction = !showAction" ref="actionButton">
            <img src="/icons/menu-vertical.svg" alt="">
        </button>
        <div class="action" v-if="showAction" ref="actionMenu">
            <ul class="list">
                <li class="element" @click.stop="$emit('actionWithPracticant', taskId, practicant.id)">
                    <p class="label">{{ action }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import AvatarLetter from '@/components/AvatarLetter.vue';

const props = defineProps({
    practicant: Object,
    action: String,
    taskId: Number,
    selectedPracticant: Object,
    practicantMark: [Number, String]
});

const emit = defineEmits(['update:practicantMark', 'actionWithPracticant']);

const localMark = ref(props.practicantMark || '');
const showAction = ref(false);
const actionButton = ref(null);
const actionMenu = ref(null);

const handleInput = () => {
    // Обновляем только локальное значение, не отправляем на сервер
    emit('update:practicantMark', localMark.value);
};

watch(() => props.practicantMark, (newVal) => {
    localMark.value = newVal;
});

const handleClickOutside = (event) => {
    if (showAction.value &&
        !actionMenu.value?.contains(event.target) &&
        !actionButton.value?.contains(event.target)) {
        showAction.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
.practicant-row {
    position: relative;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 20px;
    // border-radius: ;

    span:not(.avatar-letter) {
        flex: 1
    }

    input[type="text"] {
        width: 44px;
        height: 44px;
        text-align: center;
    }

    img.avatar {
        width: 35px;
        height: auto;
        max-height: 35px;
        object-fit: cover;
    }

    input.mark {
        text-align: center;
        width: 45px;
    }

    .action {
        width: 200px;
        border: 1px solid #D9D9D9;
        background-color: #FFFFFF;
        border-radius: 8px;
        z-index: 1000;
        position: absolute;
        // bottom: calc(100% + 10px);
        top: 0;
        right: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        .list {
            list-style-type: none;
            padding: 0px 10px;

            .element {
                color: #141414;
                transition: all 0.3s ease-out;
                border-radius: 6px;
                cursor: pointer;
                padding: 5px 10px;

                .label {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                }

            }
        }
    }
}
</style>