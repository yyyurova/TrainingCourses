<template>
    <Layout>
        <div v-if="classroom && !isLoading">
            <div class="">
                <h1>{{ classroom.title }}</h1>
                <p>{{ classroom.course.title }}</p>
            </div>

            <div class="block">
                <h2>Практиканты</h2>
                <button class="transparent border" @click="openAddUserModal">
                    Добавить практикантов
                    <img src="/icons/plus-black.svg" alt="">
                </button>
                <div class="practicants">
                    <Card v-for="member in classroom.members" :key="member.id">
                        <img v-if="member.avatar" :src="member.avatar" alt="">
                        <AvatarLetter v-else :name="member.name" />
                        <p> {{ member.name }}</p>
                        <button class="icon" @click="openConfirmDeleteMemberModal(member)">
                            <img src="/icons/x.svg" alt="">
                        </button>
                    </Card>
                </div>
            </div>

            <div class="block">
                <h2>Куратор</h2>
                <button class="transparent border" :disabled="classroom.curator.name" @click="openAddCuratorModal">
                    Добавить куратора
                    <img src="/icons/plus-black.svg" alt="" v-if="!classroom.curator.name">
                    <img src="/icons/plus-gray.svg" alt="" v-else>
                </button>
                <Card v-if="classroom.curator.name">
                    <img v-if="classroom.curator.avatar" :src="classroom.curator.avatar" alt="">
                    <AvatarLetter v-else :name="classroom.curator.name" />
                    <p>{{ classroom.curator.name }}</p>
                    <button class="icon" @click="openConfirmDeleteCuratorModal">
                        <img src="/icons/x.svg" alt="">
                    </button>
                </Card>
            </div>
        </div>
        <Loading v-if="isLoading" />

        <AddUsersToClassModal v-if="showAddUsersModal" @cancel="closeModal" @save="addMembers" />
        <AddCuratorToClassModal v-if="showAddCuratorModal" @cancel="closeModal" @save="addCurator" />

        <ConfirmDelete v-if="showConfirmDeleteCuratorModal" :question="`Удалить куратора из класса ${classroom.title}?`"
            right-button-text="Удалить" @confirm="deleteCurator" @cancel="closeModal" />

        <ConfirmDelete v-if="showConfirmDeletePracticantModal"
            :question="`Удалить ${memberToDelete.name} из класса ${classroom.title}?`"
            text="Студент потеряет доступ к курсу" right-button-text="Удалить" @confirm="deleteMember"
            @cancel="closeModal" />
        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :is-success="isSuccess" />
    </Layout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, provide, ref } from 'vue';
import {
    addUsersToClass,
    getClassroom,
    deleteUserFromClass,
    addCuratorToClass,
    deleteCuratorFromClass
} from '@/api/modules/classrooms.api';

import Layout from '@/layouts/Layout.vue';
import Popup from '@/components/Popup.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import Loading from '@/components/Loading.vue';
import Card from '@/components/Card.vue';
import AddUsersToClassModal from './modals/AddUsersToClassModal.vue';
import AddCuratorToClassModal from './modals/AddCuratorToClassModal.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';

const route = useRoute()

const classroom = ref(null)
const members = ref([])
const memberToDelete = ref(null)
// const allUsers = ref([])
const isLoading = ref(false)

const showAddUsersModal = ref(false)
const showAddCuratorModal = ref(false)
const showConfirmDeletePracticantModal = ref(false)
const showConfirmDeleteCuratorModal = ref(false)

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const closeModal = () => {
    if (showAddUsersModal.value) { showAddUsersModal.value = false }
    if (showConfirmDeletePracticantModal.value) { showConfirmDeletePracticantModal.value = false }
    if (showConfirmDeleteCuratorModal.value) { showConfirmDeleteCuratorModal.value = false }
    if (showAddCuratorModal.value) { showAddCuratorModal.value = false }
}

const closePopup = () => {
    showPopup.value = false
}

const openAddUserModal = () => {
    showAddUsersModal.value = true
}

const openAddCuratorModal = () => {
    showAddCuratorModal.value = true
}

const openConfirmDeleteMemberModal = (member) => {
    memberToDelete.value = member
    showConfirmDeletePracticantModal.value = true
}

const openConfirmDeleteCuratorModal = () => {
    showConfirmDeleteCuratorModal.value = true
}

const fetchClassroom = async () => {
    try {
        isLoading.value = true
        classroom.value = await getClassroom(route.params.classId)
        members.value = classroom.value.members
    } finally {
        isLoading.value = false
    }
}

const deleteMember = async () => {
    try {
        isLoading.value = true
        closeModal()
        await deleteUserFromClass(classroom.value.id, memberToDelete.value.id)
        await fetchClassroom()
        popupText.value = 'Практикант успешно удален'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } catch {
        popupText.value = 'Не удалось удалить практиканта'
        isSuccess.value = false
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } finally {
        isLoading.value = false
    }
}

const addMembers = async (members) => {
    try {
        isLoading.value = true
        closeModal()
        await addUsersToClass(classroom.value.id, members)
        await fetchClassroom()
        popupText.value = 'Практиканты успешно добавлены'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } catch {
        popupText.value = 'Не удалось добавить практикантов'
        isSuccess.value = false
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } finally {
        isLoading.value = false
    }
}

const addCurator = async (curatorId) => {
    try {
        isLoading.value = true
        closeModal()

        await addCuratorToClass(classroom.value.id, curatorId)
        await fetchClassroom()

        popupText.value = 'Куратор успешно добавлен'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } catch {
        popupText.value = 'Не удалось добавить куратора'
        isSuccess.value = false
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } finally {
        isLoading.value = false
    }
}

const deleteCurator = async () => {
    try {
        isLoading.value = true
        closeModal()
        await deleteCuratorFromClass(classroom.value.id)
        await fetchClassroom()

        popupText.value = 'Куратор удален'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } catch {
        popupText.value = 'Не удалось удалить куратора'
        isSuccess.value = false
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 4000);
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await fetchClassroom()
    document.title = classroom.value.title
})

provide('members', members)
</script>

<style scoped lang="scss">
div:has(.block) {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;

    .block {
        display: flex;
        flex-direction: column;
        gap: 10px;

        button:disabled {
            border-color: #969696;
            color: #969696;
        }

        .practicants {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .card {
            flex-direction: row;
            width: calc(50% - 5px);
            align-items: center;
            gap: 10px;

            p {
                flex: 1;
                word-break: break-all;
            }
        }
    }

}

@media (max-width: 768px) {
    .practicants .card {
        width: 100% !important;
    }

    button.transparent.border {
        width: 100% !important;
    }
}
</style>