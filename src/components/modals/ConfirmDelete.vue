<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>
                    <img src="/icons/danger.svg" alt="">
                    {{ question }}
                </h2>
                <p>{{ text }}</p>
                <div class="modal-buttons">
                    <button @click="$emit('cancel')" class="transparent">Отмена</button>
                    <button @click="$emit('confirm')" class="delete">Удалить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    question: String,
    text: String,
    show: {
        type: Boolean,
        default: true
    },
})

defineEmits(['confirm', 'cancel']);
</script>

<style scoped lang="scss">
.modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;


    .modal-content:not(.image) {
        max-height: 95vh;
        background-color: #fff;
        padding: 60px;
        border-radius: 8px;
        width: 550px;
        // width: fit-content;
        text-align: center;
    }

    h2 {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 20px;
        line-height: 160%;
        letter-spacing: 0px;
    }

    p {
        text-align: left;
    }

    .modal-buttons button.delete {
        background-color: #CD3232;
        color: #fff;
    }
}
</style>