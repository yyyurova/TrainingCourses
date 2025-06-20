<template>
    <AuthLayout>
        <div class="block">
            <img src="/icons/logo.svg" alt="">

            <div class="text">
                <h1>Заявка на доступ к платформе отклонена</h1>
            </div>
        </div>
    </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
</script>

<style scoped lang="scss">
.block {
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