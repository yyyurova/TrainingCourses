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
                <button class="icon ">
                    <img class="small" src="/icons/paperclip.svg" alt="">
                </button>
                <input autocomplete="off" ref="messageInput" @keypress.enter="sendMessage"
                    placeholder="Добавить комментарий к заданию" type="text" class="inp-field">
                <button class="icon" @click="sendMessage">
                    <img src="/icons/send.svg" alt="">
                </button>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { inject, watch, ref } from 'vue';

import Card from '@/components/Card.vue';
import Message from '@/components/Message.vue';

defineProps({ chat: Object })

const messages = ref([]);
const teacherName = ref('')
const messageInput = ref(null)

const course = inject('course')

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

// const fetchTeacherName = async (teacherId) => {
//     try {
//         // const user = await getUser(teacherId);
//         teacherName.value = user.name;
//     } catch (err) {
//         teacherName.value = 'Учитель не найден';
//     }
// };

// watch(() => course.value, async (newCourse) => {
//     if (newCourse && newCourse.teacher) {
//         await fetchTeacherName(newCourse.teacher);
//         initMessages();
//     }
// }, { immediate: true });

// const initMessages = () => {
//     messages.value = [
//         {
//             id: 1,
//             text: "Можно узнать, почему такая оценка?",
//             time: "19:57",
//             isMe: true
//         },
//         {
//             id: 2,
//             text: "Не вижу, где библиотека компонентов.",
//             time: "19:57",
//             isMe: false,
//             userName: teacherName.value
//         }
//     ];
// }
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
            border-radius: 0 0 8px 8px;
            border-top: 1px solid #D9D9D9;

            button.icon img.small {
                width: 28px;
                // height: fit-content;
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