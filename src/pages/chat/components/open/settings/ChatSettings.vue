<template>
    <div class="chatSettings">
        <div class="group-header">
            <div class="group-header__inner">
                <img class="arrow-left" src="/icons/arrow.svg" alt="">
                <div class="center">
                    <div class="top">
                        <img src="/image.png">
                        <p class="grop-name">{{ selectedChat.name || selectedChat.userName }}</p>
                    </div>
                    <p v-if="selectedChat.members" class="am-members">{{ pluralizeParticipants }} </p>
                </div>
                <img src="/icons/settings.svg" alt="">
            </div>
        </div>
        <Navbar :elements="navbarItems" />
        <div class="">
            <!-- здесь должен быть компонент либо участники, либо документы, либо вложения -->
        </div>
    </div>
</template>

<script setup>
import pluralize from 'pluralize-ru';
import { inject, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Navbar from '@/components/Navbar.vue';
import Members from './components/Members.vue';
import Docs from './components/Docs.vue';
import Attachments from './components/Attachments.vue';

const selectedChat = inject('selectedChat')
const route = useRoute()
const router = useRouter()
const members = ref(true)
const docs = ref(false)
const attachments = ref(false)


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
</script>
