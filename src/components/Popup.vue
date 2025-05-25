<template>
    <div class="confirmation-popup">
        <img :src="isSuccess ? '/icons/checkcircle.svg' : '/icons/danger.svg'" alt="">
        <p>{{ text }}</p>
        <button class="icon" @click="emit('closePopup')">
            <img src="/icons/x.svg" alt="">
        </button>
    </div>
</template>

<script setup>
defineProps({
    text: String,
    isSuccess: {
        type: Boolean,
        reqiured: false,
        default: true
    }
})

const emit = defineEmits(['closePopup'])
</script>

<style scoped lang="scss">
.confirmation-popup {
    position: fixed;
    top: 67%;
    left: 82%;
    transform: translate(-50%, -50%);
    background-color: #FFFFFF;
    color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 2px 0px #0000001A;

    box-shadow: 0px 2px 2px 0px #00000033;
    width: 300px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;

    p {
        flex: 1;
        margin: 0 10px 0 10px;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
    }
}
</style>