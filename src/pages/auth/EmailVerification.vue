<template>
    <AuthLayout>
        <div class="block">
            <img src="/icons/logo.svg" alt="">
            <div class="text">
                <h1>
                    Подтверждение электронной почты
                </h1>
                <p>
                    Мы отправили письмо на {{ email }}. Перейдите по ссылке в письме для активации аккаунта
                </p>
            </div>
        </div>
    </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import { getCurrentUser } from '@/utils/auth';
import { onMounted, ref } from 'vue';

const email = ref(null)
onMounted(() => {
    email.value = getCurrentUser().email
})
</script>

<style scoped lang="scss">
.block {
    display: flex;
    gap: 15px;
}
</style>