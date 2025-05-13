<template>
    <div class="chat-settings">
        <div class="chat-header">
            <div class="chat-header__inner">
                <img class="arrow-left" src="/icons/arrow.svg" alt="">
                <div class="center">
                    <div class="top">
                        <img src="/image.png">
                        <p class="grop-name">{{ selectedChat.name || selectedChat.userName }}</p>
                    </div>
                    <p v-if="selectedChat.members" class="am-members">{{ pluralizeParticipants }}</p>
                </div>
                <img src="/icons/settings.svg" alt="">
            </div>
        </div>
        <Navbar :elements="navbarItems" />
        <!-- <div class=""> -->
        <div class="settings-tab">
            <component :is="component"></component>
        </div>
        <!-- здесь должен быть компонент либо участники, либо документы, либо вложения -->
        <!-- </div> -->
    </div>
</template>

<script setup>
import pluralize from 'pluralize-ru';
import { inject, computed, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Navbar from '@/components/Navbar.vue';
import Members from './components/Members.vue';
import Docs from './components/Docs.vue';
import Attachments from './components/Attachments.vue';

const selectedChat = inject('selectedChat')
const route = useRoute()
const component = shallowRef(null);

const pluralizeParticipants = computed(() => {
    const count = Number(selectedChat.value.members.length) || 0;
    return count + ' ' + pluralize(count, 'нет участников', 'участник', 'участника', 'участников');
});

const navbarItems = computed(() => {
    if (!selectedChat.value) return [];
    return [
        { name: 'Участники', linkTo: `/chat/${selectedChat.value.id}/members` },
        { name: 'Документы', linkTo: `/chat/${selectedChat.value.id}/docs` },
        { name: 'Фотографии', linkTo: `/chat/${selectedChat.value.id}/attachments` }
    ];
});

watch(
    () => route.path,
    (path) => {
        if (path.endsWith('members')) component.value = Members;
        else if (path.endsWith('docs')) component.value = Docs;
        else if (path.endsWith('attachments')) component.value = Attachments;
    },
    { immediate: true }
);
</script>


<style scoped lang="scss">
.chat-settings {
    flex: 1;

    .chat-header {
        width: 100%;
        border-bottom: 1px solid #D9D9D9;

        .chat-header__inner {
            display: flex;
            justify-content: space-between;
            margin: 60px 10px 20px 20px;

            .center {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;

                .am-members {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    color: #787878;
                    margin-top: 10px;
                }

                .top {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    img {
                        width: 32px;
                        height: 32px;
                        border-radius: 4px;
                    }
                }
            }
        }
    }

    .settings-tab {
        padding: 10px;
    }
}
</style>