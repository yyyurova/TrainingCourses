<template>
    <Card class="no-hover comment">
        <h3>Комментарий к заданию</h3>
        <div class="chat-about-task">
            <div class="messages-in-task" id="messages">
                <p class="day">Сегодня</p>
                <div class="spacer"></div>
                <Message v-for="message in messages" :key="message.id" :message="message" />
            </div>
            <div class="input-field">
                <button class="icon pin-file other">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.5101 8.13323L10.4102 15.2331C9.56597 16.0773 8.19717 16.0773 7.35292 15.2331C6.5069 14.3871 6.50893 13.0148 7.35745 12.1713L12.8632 6.69803L14.2459 5.31536C15.9282 3.63302 18.6558 3.63302 20.3381 5.31536C22.0205 6.9977 22.0205 9.72531 20.3381 11.4076L18.9763 12.7695L13.8148 17.931C11.1448 20.7122 7.09921 21.1354 4.27061 18.4199C1.47664 15.7377 1.95021 11.7165 4.7752 8.89147L9.91637 3.74951"
                            stroke="#292929" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <input autocomplete="off" ref="messageInput" @keypress="handleKeyPress"
                    placeholder="Добавить комментарий к заданию" type="text" class="inp-field">
                <button class="icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M9 9H9.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#292929" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="icon" @click="sendMessage">
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.2562 9.00022L3.61672 9.00022M2.56359 1.59617L15.8189 8.023C16.6352 8.41878 16.6352 9.58166 15.8189 9.97744L2.56359 16.4043C1.65551 16.8445 0.690316 15.9163 1.09482 14.9918L3.52567 9.43552C3.64707 9.15802 3.64707 8.84243 3.52567 8.56492L1.09482 3.00869C0.690317 2.08412 1.65551 1.1559 2.56359 1.59617Z"
                            stroke="#292929" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    </Card>
</template>

<script setup>
import axios from 'axios';
import { inject, watch, ref } from 'vue';

import Card from '@/components/Card.vue';
import Message from '@/components/Message.vue';

const messages = ref([]);
const teacherName = ref('')
const messageInput = ref(null)

const course = inject('course')

const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
};

const sendMessage = () => {
    const text = messageInput.value.value.trim();
    if (!text) return;

    const newMessage = {
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
    };

    messages.value.push(newMessage);
    messageInput.value.value = '';

    setTimeout(() => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
};

const fetchTeacherName = async (teacherId) => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users/${teacherId}`);
        teacherName.value = data.name;
    } catch (err) {
        console.log(err);
        teacherName.value = 'Учитель не найден';
    }
};

watch(() => course.value, async (newCourse) => {
    if (newCourse && newCourse.teacher) {
        await fetchTeacherName(newCourse.teacher);
        initMessages();
    }
}, { immediate: true });

const initMessages = () => {
    messages.value = [
        {
            id: 1,
            text: "Можно узнать, почему такая оценка?",
            time: "19:57",
            isMe: true
        },
        {
            id: 2,
            text: "Не вижу, где библиотека компонентов.",
            time: "19:57",
            isMe: false,
            userName: teacherName.value
        }
    ];
}
</script>

<style scoped lang="scss">
.comment {
    padding: 0;
    border-radius: 8px;

    h3 {
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        letter-spacing: 1px;
        margin-bottom: 20px;
        padding: 20px;
    }

    .chat-about-task {
        display: flex;
        flex-direction: column;
        width: 100%;

        .messages-in-task {
            height: 200px;
            min-height: 200px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;

            .day {
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0px;
                text-align: center;
                padding-bottom: 10px;
            }
        }


        .input-field {
            width: 100%;
            padding: 7px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid #D9D9D9;

            button {
                height: fit-content;
            }
        }

        .inp-field {
            flex: 1;
            padding: 10px;
            border: none;
            outline: none;
        }

    }
}
</style>