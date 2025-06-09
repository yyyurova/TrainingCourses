<template>
    <div class="practicant-row">
        <input :checked="isSelect" type="checkbox">
        <img v-if="practicant.avatar" class="avatar" :src="practicant.avatar" alt="">
        <AvatarLetter v-else :name="practicant.name" />
        <span>{{ practicant.name }}</span>
        <input min="1" max="10" :disabled="action === 'Назначить'" @click.stop v-model="mark" class="mark" type="text"
            @blur="updateMark" @keyup.enter="updateMark">
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
import { onMounted, onUnmounted, ref } from 'vue';
import AvatarLetter from '@/components/AvatarLetter.vue';

const props = defineProps({
    isSelect: { type: Boolean, default: false },
    practicant: Object,
    action: String,
    taskId: Number,
    // courseId: Number
})

const emit = defineEmits(['actionWithPracticant', 'updateMark'])

const mark = ref(props.practicant.mark || 0)
const showAction = ref(false)
const actionButton = ref(null);
const actionMenu = ref(null);

const handleClickOutside = (event) => {
    if (
        showAction.value &&
        // !action.value?.contains(event.target)

        !actionMenu.value?.contains(event.target) &&
        !actionButton.value?.contains(event.target)
    ) {
        showAction.value = false;
    }
};

const updateMark = async () => {
    emit('updateMark',
        props.taskId, props.practicant.id, Number(mark.value),
    );
}

onUnmounted(() => {
    // updateMark();
    document.removeEventListener('click', handleClickOutside)
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.practicant-row {
    position: relative;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px;

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