<template>
    <div v-if="message" class="message" :class="message.isMe ? 'right' : 'left'">
        <div v-if="!message.isMe" class="message-header">
            <span class="username">{{ message.userName }}</span>
        </div>
        <div class="message-content">
            {{ message.text }}
            <span class="timestamp">{{ message.time }}</span>
        </div>
    </div>
    <div v-else class="message" :class="selectedChat.isMe ? 'right' : 'left'">
        <div v-if="!selectedChat.isMe" class="message-header">
            <span class="username">{{ selectedChat.name || selectedChat.userName }}</span>
        </div>
        <div class="message-content">
            {{ selectedChat.content }}
            <span class="timestamp">{{ format(selectedChat.date, { time: 'short' }) }}</span>
        </div>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';

defineProps({
    message: Object,
    selectedChat: Object
})
</script>

<style scoped lang="scss">
.message {
    border-radius: 10px 10px 0px 10px;
    max-width: 380px;
    width: fit-content;
    padding: 10px;
    // margin: 10px;

    &.left {
        border-radius: 10px 10px 10px 0px;
        align-self: flex-start;
        background-color: #F8F8F8;
    }

    &.right {
        align-self: flex-end;
        background-color: #EEEEEE;
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }

    .message-content {
        display: flex;
        gap: 10px;
        justify-content: space-between;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
        word-break: break-all;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    .username {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0px;
        color: #513DEB;
    }

    .timestamp {
        display: flex;
        align-items: flex-end;
        color: #999;
        font-size: 12px;
        white-space: nowrap;
    }

}
</style>