<template>
    <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
</template>

<style scoped lang="scss">
.loading-dots {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;

    .dot {
        width: 26px;
        height: 26px;
        background-color: #0077ff;
        border-radius: 50%;
        margin: 0 5px;
        animation: bounce 1s infinite;

        &:nth-child(2) {
            animation-delay: 0.2s;
        }

        &:nth-child(3) {
            animation-delay: 0.4s;
        }
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}
</style>