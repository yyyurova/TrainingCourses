<template>
    <AuthLayout>
        <form @submit.prevent="handleSubmit" action="" class="form authorization" novalidate>
            <img src="/icons/logo.svg" alt="Логотип">
            <h1 id="header">Вход</h1>
            <div class="field">
                <label for="email">Электронная почта<span class="required">*</span></label>
                <input v-model="email" type="email" class="email credintals" placeholder="name@email.com" required>
                <span v-if="errors.email" class="error">{{ errors.email }}</span>
            </div>
            <div class="field">
                <label for="password">Пароль<span class="required">*</span></label>
                <div class="pass-container">
                    <input v-model="password" ref="passwordInput" type="password" class="password credintals" required>
                    <img @click="switchPasswordVisibility" ref="eye" class="eye" src="/icons/eye-closed.svg" alt="">
                </div>
                <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>
            <button type="submit" class="sign-in">Войти</button>
            <div class="separator">или</div>
            <div class="google-container">
                <button class="google-sign-in">
                    Войти через Google
                    <img src="/icons/google.svg" alt="Google Icon">
                </button>
            </div>

            <div class="register-link">Нет аккаунта?
                <RouterLink to="/signup">
                    Зарегистрироваться
                </RouterLink>
            </div>
        </form>
    </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { mockUser } from '@/mocks/user';

import AuthLayout from '@/layouts/AuthLayout.vue';

const name = ref('')
const email = ref('')
const password = ref('')

const errors = ref({
    email: '',
    password: ''
})

const eye = ref(null)
const passwordInput = ref(null)

const switchPasswordVisibility = () => {
    if (passwordInput.value.type === "password") {
        passwordInput.value.type = "text"
        eye.value.src = '/icons/eye-open.svg'
    } else {
        passwordInput.value.type = "password"
        eye.value.src = '/icons/eye-closed.svg'
    }
}

const validateForm = () => {
    let isValid = true
    errors.value = { email: '', password: '' }

    if (!email.value.trim()) {
        errors.value.email = 'Пожалуйста, введите email'
        isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        errors.value.email = 'Пожалуйста, введите корректный email'
        isValid = false
    }

    if (!password.value.trim()) {
        errors.value.password = 'Пожалуйста, введите пароль'
        isValid = false
    } else if (password.value.length < 6) {
        errors.value.password = 'Пароль должен содержать минимум 6 символов'
        isValid = false
    }

    return isValid
}

const router = useRouter()
const handleSubmit = () => {
    if (validateForm()) {
        if (mockUser.role === 'admin')
            router.push('/users')
        if (mockUser.role === 'student') {
            router.push('/courses')
        }
    }
}
</script>

<style scoped lang="scss">
.form {
    width: 460px;
    background: white;
    border: 1px solid #D9D9D9;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: #292929;
    margin: 0;


    .credintals {
        width: 100%;
        border: 1px solid #D9D9D9;
        padding: 12px 20px;
        border-radius: 10px;


        &:focus {
            border: 1px solid #513DEB;
            outline: none;
        }
    }

    .sign-in,
    .sign-up {
        width: 100%;
        background-color: #513DEB;
        border-radius: 10px;
        border: none;
        padding: 12px 20px;
        color: white;
        cursor: pointer;
        font-size: 16px;
        line-height: 100%;
    }

    .google-sign-in {
        width: 100%;
        background-color: #fff;
        border: 1px solid #513DEB;
        border-radius: 10px;
        padding: 12px 20px;
        cursor: pointer;
        font-size: 16px;
        line-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .google-sign-in img {
        width: 20px;
        height: 20px;
        margin: 0;
    }

    .separator {
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0;
        line-height: 24px;
        color: #292929;
        position: relative;
        margin: 20px 0;


        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 45%;
            height: 1px;
            background-color: #D9D9D9;
        }

        &::before {
            left: 0;
        }

        &::after {
            right: 0;
        }
    }

    .register-link {
        text-align: center;
    }

    .register-link a {
        color: #513DEB;
        text-decoration: none;
    }

    .field {
        display: flex;
        flex-direction: column;
    }

    h1 {
        text-align: center;
        font-weight: 600;
        font-size: 42px;
        line-height: 130%;
        letter-spacing: 1%;
        margin: 0;
    }

    img {
        display: block;
        margin: 0 auto;
    }

    label {
        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
    }

    .eye {
        cursor: pointer;
    }

    .pass-container {
        position: relative;
        display: flex;
        align-items: center;

        input {
            width: 100%;
            padding-right: 40px;
        }

        img {
            position: absolute;
            right: 10px;
            cursor: pointer;
            width: 20px;
            height: 20px;
        }
    }

    .sign-up {
        background-color: #EBEBEB;
        color: #969696;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .verification {
        flex-direction: column;
        text-align: center;
    }

    .verification h1 {
        font-weight: 600;
        font-size: 42px;
        line-height: 130%;
        letter-spacing: 1%;
        width: 600px;

    }

    .incorrect {
        border: 1px solid red !important;
    }

    .error {
        color: red;
        font-size: 12px;
        margin-top: 5px;
    }
}

@media (max-width:480px) {
    .form {
        width: 420px;
    }
}

@media (max-width:360px) {
    .form {
        width: 300px;
    }
}
</style>