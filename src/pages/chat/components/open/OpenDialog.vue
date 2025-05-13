<template>
    <div class="open">
        <div class="dialog-header">
            <div class="dialog-header__inner" @click="() => emit('openSettings')">
                <div class="left-part">
                    <div class="f-row">
                        <!-- <img class="arrow-left" src="/icons/arrow.svg" alt=""> -->
                        <img src="/icons/Avatar.svg">
                        <h1>{{ selectedChat.userName ? selectedChat.userName : selectedChat.name }}</h1>
                    </div>
                    <p v-if="selectedChat.members" class="am-members">{{ pluralizeParticipants }}</p>
                </div>

                <div v-if="selectedChat.members" class="right-part">
                    <img src="/icons/add.svg" alt="">
                    <img src="/icons/delete.svg" alt="">
                </div>
            </div>
        </div>
        <div v-if="selectedChat.content" class="messages-in-chat">
            <div class="spacer"></div>
            <Message v-for="message in messages" :key="message.text" :message="message" />
        </div>
        <NoMessages v-else />

        <div class="files"></div>
        <div class="input-field">
            <button class="icon">
                <img src="/icons/paperclip.svg" alt="">
            </button>

            <input ref="input" placeholder="Отправить сообщение..." type="text" class="inp-field">
            <button class="icon">
                <img src="/icons/emote-smile.svg" alt="">
            </button>
            <button class="icon" @click="sendMessage">
                <img src="/icons/send.svg" alt="">
            </button>
        </div>
    </div>
</template>

<script setup>
import pluralize from 'pluralize-ru';
import { inject, watch, ref, computed } from 'vue';
import { format } from '@formkit/tempo';

import NoMessages from './NoMessages.vue';
import Message from '@/components/Message.vue';

const emit = defineEmits(['openSettings'])

const selectedChat = inject('selectedChat')
const input = ref(null)
const messages = ref([])

const pluralizeParticipants = computed(() => {
    const count = Number(selectedChat.value.members.length) || 0;
    return count + ' ' + pluralize(count, 'нет участников', 'участник', 'участника', 'участников');
});

const sendMessage = () => {
    const text = input.value.value.trim();
    if (!text) return;

    const newMessage = {
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
    };

    messages.value.push(newMessage);
    input.value.value = '';

    setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-in-chat');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
};

watch(selectedChat, (newChat) => {
    if (newChat) {
        messages.value = [{
            userName: newChat.userName || newChat.name,
            text: newChat.content,
            time: format(newChat.date, { time: 'short' })
        }]
    }
}, { immediate: true })

</script>
<style scoped lang="scss">
.open {
    width: 55%;
    max-width: 55%;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .dialog-header {
        width: 100%;
        border-bottom: 1px solid #D9D9D9;

        .dialog-header__inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 60px 10px 20px 20px;
            cursor: pointer;
            position: relative;


            .f-row {
                display: flex;
                align-items: center;
                gap: 10px;

                h1 {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    margin: 0;
                    padding: 0;
                }
            }

            .am-members {
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0px;
                color: #787878;
                margin-top: 10px;
            }
        }
    }

    .messages-in-chat {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 10px;
        gap: 10px;
        flex: 1;

        .message {
            margin: 0;
        }
    }

    .input-field {
        width: 100%;
        padding: 7px;
        display: flex;
        align-items: center;
        gap: 7px;
        border: 1px solid #D9D9D9;

        img {
            width: 24px;
            height: 24px;

            &:nth-child(3) {
                width: 21px;
                height: 21px;
            }
        }

        .inp-field {
            flex: 1;
            padding: 10px 5px;
            border: none;
            outline: none;
        }
    }
}
</style>