<template>
    <div class="block">
        <img src="/icons/module-reward.svg" alt="">

        <h1>Вы завершили данный модуль</h1>

        <p>Данный модуль завершён, переходите к следующему для изучения нового материала</p>

        <button class="blue" @click="$emit('next')">Следующий модуль</button>
    </div>
</template>

<script setup>
const emit = defineEmits(['next'])
</script>

<style scoped lang="scss">
.block {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    width: 100%;
    justify-content: center;
    margin-top: 50px;

    img {
        width: 70px;
    }

    h1 {
        font-weight: 600;
        font-size: 36px;
        line-height: 42px;
        letter-spacing: 1px;
        text-align: center;
    }

    p {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: center;
    }
}
</style>