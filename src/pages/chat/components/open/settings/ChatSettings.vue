<template>
    <div class="chat-settings">
        <div class="chat-header" ref="header">
            <div class="chat-header__inner">
                <button class="icon back" @click="leaveSettings">
                    <img class="arrow-left" src="/icons/arrow.svg" alt="">
                </button>

                <div class="center">
                    <div class="top">
                        <img v-if="selectedChat.avatar" :src="getAvatarUrl(selectedChat.avatar)">
                        <AvatarLetter v-else :name="selectedChat.title" />
                        <p class="grop-name">{{ selectedChat.title }}</p>
                    </div>

                    <p v-if="selectedChat.is_group === 1" class="am-members">{{ pluralizeParticipants }}</p>
                </div>

                <button v-if="selectedChat.is_group === 1" class="icon big" @click="openShowEditChatModal">
                    <img src="/icons/settings.svg" alt="">
                </button>

                <button v-else class="icon big" @click="openConfirmDeleteModal">
                    <img src="/icons/delete.svg" alt="">
                </button>
            </div>
        </div>

        <Navbar :elements="navbarItems" ref="navbar" />

        <div class="settings-tab" :style="{ maxHeight: contentHeight + 'px' }">
            <component :is="component"></component>
        </div>
    </div>

    <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить чат?"
        text="Удалённую переписку нельзя будет восстановить" right-button-text="Удалить"
        @confirm="deleteChat(selectedChat.id)" @cancel="closeModal" />

    <EditChat v-if="showEditChatModal" @cancel="closeModal" />
</template>

<script setup>
import pluralize from 'pluralize-ru';
import { inject, computed, shallowRef, watch, ref, onMounted, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getChatAttachments } from '@/api/modules/chat.api';

import Navbar from '@/components/Navbar.vue';
import Members from './components/members/Members.vue';
import Docs from './components/Docs.vue';
import Attachments from './components/attachments/Attachments.vue';

import AvatarLetter from '@/components/AvatarLetter.vue';

import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import EditChat from './components/modals/EditChat.vue';

const selectedChat = inject('selectedChat')
const settingsIsOpen = inject('settingsIsOpen')
const deleteChat = inject('deleteChat')

const route = useRoute()
const router = useRouter()

const component = shallowRef(null);
const contentHeight = ref(0);

const header = ref(null)
const navbar = ref(null)

const docs = ref([])
const images = ref([])

const showEditChatModal = ref(false)
const showConfirmDeleteModal = ref(false)

const openConfirmDeleteModal = () => {
    showConfirmDeleteModal.value = true
}

const fetchFiles = async () => {
    try {
        const data = await getChatAttachments(selectedChat.value.id)
        docs.value = data.files
        images.value = data.images
    } catch (err) { console.log(err) }
}

const closeModal = () => {
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
    if (showEditChatModal.value) { showEditChatModal.value = false }
}

const openShowEditChatModal = () => {
    showEditChatModal.value = true
}

const pluralizeParticipants = computed(() => {
    const count = Number(selectedChat.value.members_count) || 0;
    return count + ' ' + pluralize(count, 'нет участников', 'участник', 'участника', 'участников');
});

const calculateContentHeight = () => {
    if (!header.value || !navbar.value) return;

    const headerHeight = header.value.offsetHeight;
    const navbarHeight = navbar.value.$el.offsetHeight;
    const windowHeight = window.innerHeight;

    contentHeight.value = windowHeight - headerHeight - navbarHeight;
};

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/avatar.png';
    return `https://api-course.hellishworld.ru${avatarPath}`;
}

const navbarItems = computed(() => {
    if (!selectedChat.value) return [];

    let result;
    if (selectedChat.value.members) {
        result = [
            { name: 'Участники', linkTo: `/chat/${selectedChat.value.id}/members` },
            { name: 'Документы', linkTo: `/chat/${selectedChat.value.id}/docs` },
            { name: 'Фотографии', linkTo: `/chat/${selectedChat.value.id}/attachments` }
        ];
    } else {
        result = [
            { name: 'Документы', linkTo: `/chat/${selectedChat.value.id}/docs` },
            { name: 'Фотографии', linkTo: `/chat/${selectedChat.value.id}/attachments` }
        ];
    }
    return result
});

const leaveSettings = () => {
    router.back()
    settingsIsOpen.value = false
}

watch(
    () => route.path,
    (path) => {
        if (path.endsWith('members')) component.value = Members;
        else if (path.endsWith('docs')) component.value = Docs;
        else if (path.endsWith('attachments')) component.value = Attachments;
    },
    { immediate: true }
);

onMounted(async () => {
    await fetchFiles()
    calculateContentHeight();
    window.addEventListener('resize', calculateContentHeight);
});

provide('docs', docs)
provide('images', images)
</script>

<style scoped lang="scss">
.chat-settings {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .chat-header {
        min-width: 0;
        width: 100%;
        border-bottom: 1px solid #D9D9D9;

        .chat-header__inner {
            display: flex;
            justify-content: space-between;
            margin: 60px 10px 20px 20px;

            button.icon.big img {
                width: 36px !important;
            }

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
        flex: 1;
        overflow-y: auto;
    }
}
</style>