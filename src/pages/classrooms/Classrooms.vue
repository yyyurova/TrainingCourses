<template>
    <Layout>
        <h1>Учебные классы</h1>
        <button class="blue" @click="openCreateModal">
            <span>Создать учебный класс</span>
            <img src="/icons/plus.svg" alt="">
        </button>

        <Loading v-if="isLoading" />

        <div class="classrooms" v-if="classrooms && !isLoading">
            <Card v-for="classroom in classrooms" :key="classroom.id" @click="goToClassroom(classroom.id)">
                <div class="left">
                    <p class="name">{{ classroom.title }}</p>
                    <p class="course">{{ classroom.course.title }}</p>
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
                    <button class="icon edit" @click.stop="openEeditModal(classroom)">
                        <img src="/icons/pen.svg" alt="">
                    </button>
                    <button class="icon delete" @click.stop="openDeleteModal(classroom)">
                        <img src="/icons/delete.svg" alt="">
                    </button>
                </div>
            </Card>
        </div>

        <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить учебный класс?"
            text="Студенты и куратор потеряют доступ к курсу" right-button-text="Удалить" @confirm="deleteClassroom"
            @cancel="closeModal" />

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :is-success="isSuccess" />

        <EditClassroom v-if="showEditModal" :classroom="selectedClassroom" @cancel="closeModal" @edit="editClassroom" />

        <CreateClassroom v-if="showCreateModal" @cancel="closeModal" @next="openAddModal" />

        <AddCuratorAndMEmbers v-if="showAddCuratorAndMembersModal" @cancel="closeModal" @save="handleSave" />
    </Layout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getClassrooms, deleteClass, createClassroom, addCuratorToClass, addUsersToClass, editClass } from '@/api/modules/classrooms';

import Layout from '@/layouts/Layout.vue';
import Card from '@/components/Card.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import Popup from '@/components/Popup.vue';
import EditClassroom from './modals/EditClassroom.vue';
import CreateClassroom from './modals/СreateClassroom.vue'
import Loading from '@/components/Loading.vue';
import AddCuratorAndMEmbers from './modals/AddCuratorAndMEmbers.vue';

const classrooms = ref([])

const isLoading = ref(false)

const showConfirmDeleteModal = ref(false)
const showEditModal = ref(false)
const showCreateModal = ref(false)
const showAddCuratorAndMembersModal = ref(false)

const selectedClassroom = ref(null)

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const router = useRouter()

const closeModal = () => {
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
    if (showEditModal.value) { showEditModal.value = false }
    if (showCreateModal.value) { showCreateModal.value = false }
    if (showAddCuratorAndMembersModal.value) { showAddCuratorAndMembersModal.value = false }
}

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const openDeleteModal = (classroom) => {
    showConfirmDeleteModal.value = true
    selectedClassroom.value = classroom
}

const openEeditModal = (classroom) => {
    selectedClassroom.value = classroom
    showEditModal.value = true
}

const goToClassroom = (id) => {
    router.push(`/classrooms/${id}`)
}

const openCreateModal = () => {
    showCreateModal.value = true
}

const openAddModal = async (classroomData) => {
    try {
        isLoading.value = true;
        const response = await createClassroom({
            title: classroomData.title,
            course_id: classroomData.course_id
        });
        createdClassroomId.value = response.id;
        closeModal();
        showAddCuratorAndMembersModal.value = true;
    } catch (error) {
        showMessage('Ошибка при создании класса', false)
    } finally {
        isLoading.value = false;
    }
};

const handleSave = async (data) => {
    try {
        isLoading.value = true;
        if (data.curator_id) {
            await addCuratorToClass(createdClassroomId.value, data.curator_id);
        }

        if (data.members && data.members.length > 0) {
            await addUsersToClass(createdClassroomId.value, data.members);
        }

        showMessage('Класс успешно создан', true)
        closeModal();
        await fetchClassrooms();
    } catch (error) {
        showMessage('Ошибка при сохранении данных', false)
    } finally {
        isLoading.value = false;
    }
};

const deleteClassroom = async () => {
    if (!selectedClassroom.value) return
    try {
        isLoading.value = true
        closeModal()
        await deleteClass(selectedClassroom.value.id)
        await fetchClassrooms()

        showMessage('Учебный класс удален', true)
    } catch {
        showMessage('Не удалось удалить учебный класс', false)
    }
    finally {
        isLoading.value = false
    }
}

const editClassroom = async (updatedClassroom) => {
    if (!updatedClassroom) return
    try {
        closeModal()
        await editClass(updatedClassroom.id, updatedClassroom)
        await fetchClassrooms()

        showMessage('Изменения сохранены', true)
    } catch (err) {
        console.log(err)
        showMessage('Не удлось сохранить изменения', false)
    }
}

const fetchClassrooms = async () => {
    isLoading.value = true;
    try {
        classrooms.value = await getClassrooms();
    } catch (error) {
        showMessage('Ошибка загрузки классов', false)
    } finally {
        isLoading.value = false;
    }
};

const createdClassroomId = ref(null);
const save = async () => {
    try {
        isLoading.value = true;

        const curator = classroomMembers.value.find(member => member.role === 'curator');
        if (curator) {
            await addCuratorToClass(createdClassroomId.value, curator.id);
        }

        await addUsersToClass(createdClassroomId.value, classroomMembers.value);

        showMessage('Класс успешно создан', true)

        await fetchClassrooms();
    } catch (error) {
        showMessage('Ошибка при сохранении данных', false)
    } finally {
        isLoading.value = false;
    }
};

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
        cursor: pointer;
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