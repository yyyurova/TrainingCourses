<template>
    <AuthLayout>
        <div class="logo"><img src="/icons/logo.svg" alt=""></div>
        <div class="text">
            <h1>
                Подтверждение электронной почты
            </h1>
            <p>
                Мы отправили письмо на {{ email }}. Перейдите по ссылке в письме для активации аккаунта
            </p>
        </div>
    </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import { getCurrentUser } from '@/utils/auth';

const email = getCurrentUser().email
</script>