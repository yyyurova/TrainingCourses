<template>
    <div class="dialog">
        <div class="dialog-card-header">
            <div class="header-left-part">
                <img v-if="chat.avatar" :src="chat.avatar">
                <AvatarLetter v-else :name="chat.title" />
                <p class="partner-name">{{ chat.title }}</p>
            </div>

            <button class="icon" @click.stop="$emit('delete', chat.id)">
                <img src="/icons/actions/delete.svg" alt="">
            </button>
        </div>

        <div class="dialog-content" v-if="chat.latest_message">
            <div class="text">
                <p v-if="chat.latest_message.message && chat.latest_message.message !== 'null'" class="message-preview">
                    {{ chat.latest_message.message }} </p>
                <p v-else-if="chat.latest_message.attachments.length > 0" class="attachment-preview">
                    <img src="/icons/file.svg" alt="">
                    {{ chat.latest_message.attachments[0].name }}
                </p>
                <p class="date">{{ format(chat.latest_message.created_at, 'short') }}</p>
            </div>
            <span v-if="chat.unviewed" class="circle">{{ chat.unviewed }}</span>
        </div>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';

import AvatarLetter from '@/components/AvatarLetter.vue';

const emit = defineEmits(['delete'])
const props = defineProps({
    chat: Object,
})
</script>

<style scoped lang="scss">
.dialog {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 100%;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    padding: 15px 10px;

    .dialog-card-header {
        display: flex;
        align-items: center;

        .header-left-part {
            flex: 1%;
            display: flex;
            gap: 8px;
            align-items: center;

            img {
                width: 35px;
                height: 35px;
                border-radius: 4px;
                object-fit: cover;
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

            .message-preview {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0px;
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