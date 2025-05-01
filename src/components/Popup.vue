<template>
    <div class="confirmation-popup">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                fill="#007843" />
            <path d="M17.0001 9L10 16L7 13" stroke="#F5F5F5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p>{{ text }}</p>
        <svg @click="emit('closePopup')" class="delete-popup" width="32" height="32" viewBox="0 0 32 32" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M23 9L9 23M9.00001 9L23 23" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
</template>

<script setup>
defineProps({
    text: String,
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

    .delete-popup {
        cursor: pointer;
    }
}
</style>