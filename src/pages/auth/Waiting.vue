<template>
    <AuthLayout>
        <div class="block">
            <img src="/icons/logo.svg" alt="">

            <div class="text">
                <h1> Ожидание одобрения</h1>

                <p>Ваша заявка принята. Доступ будет предоставлен после подтверждения администратором</p>
            </div>
        </div>
    </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
</script>

<style scoped lang="scss">
.block {
    * {
        text-align: center;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    img {
        width: 70px;
        height: auto;
    }
}
</style>