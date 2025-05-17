<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <div class="top-row">
                    <img src="/icons/danger.svg" alt="">
                    <h2>{{ question }}</h2>
                </div>
                <p v-if="text">{{ text }}</p>
                <div class="modal-buttons">
                    <button @click="$emit('cancel')" class="transparent">Отмена</button>
                    <button @click="$emit('confirm')" class="delete">{{ rightButtonText }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    question: String,
    text: String,
    rightButtonText: String
})

defineEmits(['confirm', 'cancel']);
</script>

<style scoped lang="scss">
.modal {

    .top-row {
        padding: 10px;
        width: 400px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        font-weight: 600;
        font-size: 20px;
        line-height: 160%;
        letter-spacing: 0px;

        h2 {
            width: 320px;
            margin: 0;
        }
    }

    p {
        padding: 10px;
        text-align: left;
    }

    .modal-buttons button.delete {
        background-color: #CD3232;
        color: #fff;
    }
}
</style>