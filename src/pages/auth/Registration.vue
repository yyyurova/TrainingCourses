<template>
    <AuthLayout>
        <form @submit.prevent="handleSubmit" class="form" novalidate>
            <img src="/icons/logo.svg" alt="Логотип">
            <h1 id="header">Регистрация</h1>

            <div class="field">
                <label for="first-last-name">Имя и Фамилия<span class="required">*</span></label>
                <input name="name" v-model="name" type="text" autocomplete="name" class="first-last-name credintals"
                    placeholder="Иван Иванов" :class="{ 'incorrect': errors.name }">
                <span v-if="errors.name" class="error">{{ errors.name }}</span>
            </div>

            <div class="field">
                <label for="email">Электронная почта<span class="required">*</span></label>
                <input name="email" v-model="email" type="email" autocomplete="email" class="email credintals"
                    placeholder="name@email.com" :class="{ 'incorrect': errors.email }">
                <span v-if="errors.email" class="error">{{ errors.email }}</span>
            </div>

            <div class="field">
                <label for="password">Пароль<span class="required">*</span></label>
                <div class="pass-container">
                    <input name="password" ref="passwordInput" v-model="password" type="password" autocomplete="off"
                        class="password credintals" :class="{ 'incorrect': errors.password }">
                    <img @click="switchPasswordVisibility" ref="eye" class="eye" src="/icons/eye-closed.svg" alt="">
                </div>
                <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>
            <span v-if="errors.all" class="error">{{ errors.all }}</span>
            <button type="submit" class="blue wide" :disabled="!isFormFilled">Зарегистрироваться</button>

            <div class="separator">или</div>
            <div class="google-container">
                <button class="transparent border wide" @click.prevent="signInWithGoogle">
                    Войти через Google
                    <img src="/icons/google.svg" alt="Google Icon">
                </button>
            </div>

            <div class="register-link">Уже зарегистрированы?
                <RouterLink to="/">
                    Войти
                </RouterLink>
            </div>
        </form>
    </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { register, getLoginUrls } from '@/api/modules/auth.api';

const name = ref('')
const email = ref('')
const password = ref('')

const googleUrl = ref('')

const errors = ref({
    name: '',
    email: '',
    password: ''
})

const eye = ref(null)
const passwordInput = ref(null)

const isFormFilled = computed(() => {
    return name.value.trim() !== '' &&
        email.value.trim() !== '' &&
        password.value.trim() !== ''
})

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
    errors.value = { name: '', email: '', password: '' }

    if (!name.value.trim()) {
        errors.value.name = 'Пожалуйста, введите имя и фамилию'
        isValid = false
    }

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

const handleSubmit = async () => {
    if (validateForm()) {
        try {
            const resp = await register(
                name.value,
                email.value,
                password.value
            )
            localStorage.setItem('token', resp.data.data.access_token)
            localStorage.setItem('user', JSON.stringify({
                id: resp.data.data.id,
                name: resp.data.data.name,
                role: resp.data.data.role,
                email: resp.data.data.email,
            }));

            router.push('/verification')
        }
        catch (err) {
            if (err.response && err.response.status === 422) {
                const errorData = err.response.data;

                errors.value = { name: '', email: '', password: '', all: '' };
                if (errorData.errors) {
                    if (errorData.errors.email) {
                        errors.value.email = errorData.errors.email[0];
                        if (errorData.errors.email[0] === 'The email has already been taken.') {
                            errors.value.email = 'Этот адрес электронной почты уже зарегистрирован в системе.'
                        }
                        if (errorData.errors.email[0] === 'The email field must be a valid email address.') {
                            errors.value.email = 'Пожалуйста, введите корректный email'
                        }
                    }
                    if (errorData.errors.password) {
                        errors.value.password = errorData.errors.password[0];
                    }
                    if (errorData.errors.name) {
                        errors.value.name = errorData.errors.name[0];
                    }
                } else if (errorData.message) {
                    errors.value.all = errorData.message;
                }
            } else {
                // Другие ошибки (например, проблемы с сетью)
                errors.value.all = 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.';
                console.error('Registration error:', err);
            }
        }
    }
}

const signInWithGoogle = async () => {
    try {
        googleUrl.value = await getLoginUrls();
        // googleUrl.value = urls.google_url;
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

    button:disabled {
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

    .sign-up {
        background-color: #513DEB !important;
        color: white !important;
        cursor: pointer;
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