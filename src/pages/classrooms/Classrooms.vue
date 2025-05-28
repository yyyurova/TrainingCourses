<template>
    <Layout>
        <h1>Учебные классы</h1>
        <button class="blue" @click="openCreateModal">
            <span>Создать учебный класс</span>
            <img src="/icons/plus.svg" alt="">
        </button>
        <div class="classrooms">
            <Card v-for="classroom in classrooms" :key="classroom.id">
                <div class="left">
                    <p class="name">{{ classroom.name }}</p>
                    <p class="course">{{ classroom.course }}</p>
                    <p class="members">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20.3999 21.5999L20.4003 18.0002C20.4004 16.0119 18.7886 14.3999 16.8003 14.3999H7.20099C5.21292 14.3999 3.60121 16.0114 3.60099 17.9995L3.60059 21.5999M15.6006 5.9999C15.6006 7.98813 13.9888 9.5999 12.0006 9.5999C10.0124 9.5999 8.40059 7.98813 8.40059 5.9999C8.40059 4.01168 10.0124 2.3999 12.0006 2.3999C13.9888 2.3999 15.6006 4.01168 15.6006 5.9999Z"
                                stroke="#292929" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {{ classroom.members ? classroom.members.length : 0 }}
                    </p>
                </div>
                <div class="right">
                    <button class="icon edit" @click="openEeditModal(classroom)">
                        <img src="/icons/pen.svg" alt="">
                    </button>
                    <button class="icon delete" @click="openDeleteModal(classroom)">
                        <img src="/icons/delete.svg" alt="">
                    </button>
                </div>
            </Card>
        </div>
        <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить учебный класс?"
            text="Студенты и куратор потеряют доступ к курсу" right-button-text="Удалить" @confirm="deleteClassroom"
            @cancel="closeModal" />

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" />

        <EditClassroom v-if="showEditModal" :classroom="selectedClassroom" @cancel="closeModal" @edit="editClassroom" />

        <CreateClassroom v-if="showCreateModal" @cancel="closeModal" @create="createClassroom" />
    </Layout>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { getClassrooms } from '@/api/modules/classrooms.api';

import Layout from '@/layouts/Layout.vue';
import Card from '@/components/Card.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import Popup from '@/components/Popup.vue';
import EditClassroom from './modals/EditClassroom.vue';
import CreateClassroom from './modals/СreateClassroom.vue'

const classrooms = ref('')

const showConfirmDeleteModal = ref(false)
const showEditModal = ref(false)
const showCreateModal = ref(false)

const selectedClassroom = ref(null)

const showPopup = ref(false)
const popupText = ref('')

const closeModal = () => {
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
    if (showEditModal.value) { showEditModal.value = false }
    if (showCreateModal.value) { showCreateModal.value = false }
}

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

const openDeleteModal = (classroom) => {
    showConfirmDeleteModal.value = true
    selectedClassroom.value = classroom
}

const openEeditModal = (classroom) => {
    selectedClassroom.value = classroom
    showEditModal.value = true
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const deleteClassroom = async () => {
    if (!selectedClassroom.value) return
    try {
        closeModal()
        await axios.delete(`https://c1a9f09250b13f61.mokky.dev/classrooms/${selectedClassroom.value.id}`)
        await fetchClassrooms()
        popupText.value = 'Учебный класс удален'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    } catch (err) {
        console.log(err)
    }
}

const editClassroom = async (updatedClassroom) => {
    if (!updatedClassroom) return
    try {
        closeModal()
        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/classrooms/${updatedClassroom.id}`, {
            name: updatedClassroom.name
        })
        await fetchClassrooms()
        popupText.value = 'Изменения сохранены'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    } catch (err) {
        console.log(err)
    }
}

const createClassroom = async (classroomData) => {
    if (!classroomData) return
    try {
        await axios.post(`https://c1a9f09250b13f61.mokky.dev/classrooms`, {
            name: classroomData.name,
            course: classroomData.course.name,
            members: classroomData.members.map(member => member.id)
        })
        await fetchClassrooms()
        popupText.value = 'Учебный класс создан'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    }
    catch (err) { console.log(err) }
}

const fetchClassrooms = async () => {
    classrooms.value = await getClassrooms()
}

onMounted(async () => {
    await fetchClassrooms()
})
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}

div.classrooms {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 15px 0;

    .card {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        .left {
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        .right {
            display: flex;
            gap: 8px;
        }

        p.name {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            letter-spacing: 1px;
        }

        p.course {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
            color: #787878;
        }

        p.members {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
        }
    }
}

@media (max-width:1280px) {
    .card {
        width: 49% !important;
    }
}

@media (max-width:768px) {
    .card {
        width: 100% !important;
    }
}

@media (max-width:360px) {
    button.blue {
        width: 100%;
    }
}
</style>