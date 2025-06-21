<template>
    <div v-if="message" class="message" :class="message.user.id === getUserId() ? 'right' : 'left'">
        <div v-if="!message.isMe" class="message-header">
            <span class="username">{{ message.user.name }}</span>
        </div>
        <div class="message__inner">
            <div class="message-content">
                <p v-if="message.message !== 'null'">{{ message.message }}</p>
                <div class="files" v-if="message.attachments.length > 0">
                    <div v-for="attachment in message.attachments" :key="attachment.id" class="file">
                        <button class="icon">
                            <img src="/icons/file.svg" alt="">
                        </button>
                        <!-- <p>{{ attachment.url }}</p> -->
                        <a :href="attachment.url">{{ attachment.name }}</a>
                    </div>
                </div>
            </div>
            <span class="timestamp">{{ format(message.created_at, { time: 'short' }) }}</span>
        </div>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';
import { getUserId } from '@/utils/auth';

const props = defineProps({
    message: Object,
})
</script>

<style scoped lang="scss">
.message {
    border-radius: 10px 10px 0px 10px;
    max-width: 380px;
    width: fit-content;
    padding: 10px;
    margin: 5px;

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

    .message__inner {
        display: flex;
        gap: 10px;

        .message-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
            justify-content: space-between;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
            word-break: break-all;
            overflow-wrap: break-word;
            word-break: break-word;

            .files {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 7px;

                .file {
                    width: 100%;
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;

                    p {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    button.icon {
                        padding: 7px;
                        border: 1px solid #513DEB;

                        img {
                            width: 20px;
                        }
                    }

                    a {
                        text-decoration: none;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }
    }

    .username {
        word-break: break-all;
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