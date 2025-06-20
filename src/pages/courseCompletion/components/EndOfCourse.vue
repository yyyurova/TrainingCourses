<template>
    <div class="block">
        <img src="/icons/course-reward.svg" alt="">

        <h1>Вы успешно завершили курс!</h1>

        <p>Поздравляю! Данный курс успешно завершён. Переходите на страницу курсов и выбирайте следующий</p>

        <button class="blue" @click="goToCourses">Страница курсов</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const goToCourses = () => {
    router.push('/courses')
}
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