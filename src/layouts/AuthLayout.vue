<template>
    <main>
        <div class="container">
            <slot></slot>
        </div>
    </main>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 40px 20px;

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

        .eye-closed {
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

        .error {
            color: red;

            font-weight: 400;
            font-size: 12px;
            line-height: 130%;
            width: 600px;
            margin-top: 5px;

        }

        .incorrect {
            border: 1px solid red;
        }
    }
}
</style>