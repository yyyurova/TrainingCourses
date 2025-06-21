<template>
    <AuthLayout>
        <form @submit.prevent="handleSubmit" action="" class="form authorization" novalidate>
            <img src="/icons/logo.svg" alt="Логотип">

            <h1 id="header">Вход</h1>

            <div class="field">
                <label for="email">Электронная почта<span class="required">*</span></label>
                <input name="email" autocomplete="email" v-model="email" type="email" class="email credintals"
                    placeholder="name@email.com" required>
                <span v-if="errors.email" class="error">{{ errors.email }}</span>
            </div>

            <div class="field">
                <label for="password">Пароль<span class="required">*</span></label>
                <div class="pass-container">
                    <input name="password" autocomplete="off" v-model="password" ref="passwordInput" type="password"
                        class="password credintals" required>
                    <img @click="switchPasswordVisibility" ref="eye" class="eye" src="/icons/eye-closed.svg" alt="">
                </div>
                <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>

            <span v-if="errors.all" class="error">{{ errors.all }}</span>
            <button type="submit" class="blue wide" :disabled="!(email.trim() && password.trim())">Войти</button>

            <div class="separator">или</div>

            <div class="google-container">
                <span v-if="errors.google" class="error">{{ errors.google }}</span>
                <button class="transparent border wide" @click.prevent="signInWithGoogle">
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
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, getLoginUrls } from '@/api/modules/auth';
import { addRoleRoutes } from '@/router';

import AuthLayout from '@/layouts/AuthLayout.vue';

const email = ref('');
const password = ref('');
const errors = ref({});
const passwordInput = ref(null);
const eye = ref(null);
const router = useRouter();
const googleUrl = ref('');

const switchPasswordVisibility = () => {
    passwordInput.value.type = passwordInput.value.type === "password"
        ? "text"
        : "password";
    eye.value.src = passwordInput.value.type === "password"
        ? '/icons/eye-closed.svg'
        : '/icons/eye-open.svg';
};

const validateForm = () => {
    let isValid = true;
    errors.value = {};

    if (!email.value.trim()) {
        errors.value.email = 'Пожалуйста, введите email';
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        errors.value.email = 'Пожалуйста, введите корректный email';
        isValid = false;
    }

    if (!password.value.trim()) {
        errors.value.password = 'Пожалуйста, введите пароль';
        isValid = false;
    } else if (password.value.length < 6) {
        errors.value.password = 'Пароль должен содержать минимум 6 символов';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        const resp = await login(email.value, password.value);
        localStorage.setItem('token', resp.data.data.access_token);

        localStorage.setItem('user', JSON.stringify({
            id: resp.data.data.id,
            name: resp.data.data.name,
            role: resp.data.data.role,
            email: resp.data.data.email,
            image: resp.data.data.image,
            status: resp.data.data.status
        }));
        if (resp.data.data.status === 'rejected') {
            await nextTick()
            router.push('/denied')
            return
        }
        if (resp.data.data.status === 'pending') {
            await nextTick()
            router.push('/waiting')
            return
        }
        addRoleRoutes(resp.data.data.role);
        await nextTick()
        router.push('/courses');
    } catch (err) {
        console.error('Ошибка входа:', err);
        errors.value.all = 'Неправильные email или пароль';
    }
};

const signInWithGoogle = async () => {
    try {
        googleUrl.value = await getLoginUrls();
        if (googleUrl.value) {
            window.location.href = googleUrl.value.google_url;
        }
    } catch (error) {
        console.error('Ошибка при получении URL для входа:', error);
        errors.value.google = 'Не удалось получить ссылку для входа';
    }
};

onMounted(() => {
    document.querySelector('input').focus()

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('google_error')) {
        errors.value.google = 'Google login failed. Please try again.';
        window.history.replaceState({}, document.title, window.location.pathname);
    }
})
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

    .google-container {
        display: flex;
        flex-direction: column;
        gap: 10px;

        button {
            img {
                margin: 0;
            }
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

        &:last-child {
            margin: 0 !important;
        }
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