<template>
    <div class="dialog">
        <div class="dialog-card-header">
            <div class="header-left-part">
                <img src="/icons/users.svg" alt="">

                <!-- <img :src="chat.avatar ? chat.avatar : '/avatar.png'"> -->
                <img src="/avatar.png" alt="">

                <p class="partner-name">{{ chat.title }}</p>
            </div>
            <button class="icon" @click="$emit('delete', chat.id)">
                <img src="/icons/delete.svg" alt="">
            </button>
        </div>
        <div class="dialog-content">
            <div class="text" v-if="chat.latest_message">
                <p v-if="chat.latest_message.message && chat.latest_message.message !== 'null'" class="message-preview">
                    {{
                        chat.latest_message.message }} </p>
                <p v-else-if="chat.latest_message.attachments.length > 0" class="attachment-preview">
                    <img src="/icons/file.svg" alt="">
                    {{ chat.latest_message.attachments[0].url }}
                </p>
                <p class="date">{{ format(chat.latest_message.created_at, 'short') }}</p>
            </div>
            <!-- <span v-if="chat.unread" class="circle">{{ chat.unread }}</span> -->
        </div>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';
defineProps({
    chat: Object,
})

const emit = defineEmits(['delete'])
</script>

<style scoped lang="scss">
.dialog {
    max-width: 100%;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    padding: 15px 10px;


    .dialog-card-header {
        display: flex;
        align-items: center;
        // justify-content: space-between;
        margin-bottom: 10px;

        .header-left-part {
            flex: 1%;
            display: flex;
            gap: 8px;
            align-items: center;

            img {
                &:nth-child(1) {
                    width: 16px;
                }

                width: auto;
                height: 36px;
                border-radius: 4px;
            }

            .partner-name {
                width: 80%;
            }
        }


    }

    .dialog-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        .text {
            display: flex;
            flex-direction: column;
            width: 85%;
            gap: 10px;
            flex: 1;

            .message-preview,
            .attachment-preview {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                // max-width: 100%;
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0px;
            }

            .attachment-preview {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .date {
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0px;
                color: #787878;
            }
        }
    }
}
</style>