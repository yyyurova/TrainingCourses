<template>
    <Layout :on-create-task="openCreateTaskModal">
        <h1>Задания</h1>
        <div v-if="course">
            <Navbar :elements="navbarItems" />
            <button class="blue" @click="openCreateTaskModal" :disabled="!practicants || practicants.length === 0"
                :title="!practicants || practicants.length === 0 ? 'В курсе нет практикантов' : ''">
                Создать задание
                <img src="/icons/plus.svg" alt="">
            </button>
            <div class="tasks" v-if="!isLoading && tasks">
                <TaskCard v-for="task in tasks" :task="task" :key="task.id" @click="goToWorks(task.id)"
                    @delete="openDeleteModal(task)" @edit="openEditModal(task)" />
            </div>
            <div class="no-items" v-if="tasks.length === 0">
                <h2>В этом курсе пока нет заданий</h2>
            </div>
        </div>
        <EditTask v-if="showEditModal" :task="taskToEdit" @cancel="closeModal" @save="editTask" />

        <CreateTask v-if="showCreateTaskModal" @cancel="closeModal" @create="createTask" :users="practicants" />

        <Loading v-if="isLoading" />
        <Popup v-if="showPopup" :text="popupText" :is-success="isSuccess" @close-popup="closePopup" />
        <ConfirmDelete v-if="showDeleteModal" @confirm="deleteTask(taskToDelete.id)" @cancel="closeModal"
            question="Удалить задание?" right-button-text="Удалить"
            text="Оценки, комментарии и информация о задании будут удалены" />
    </Layout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCourse } from '@/api/modules/courses.api';
import { getPracticants } from '@/api/modules/curarorStudents.api';
import { getTasksByCourse, createTask as apiCreateTask, deleteTask as apiDeleteTask, updateTask } from '@/api/modules/tasks.api';

import CreateTask from './components/modals/CreateTask.vue';
import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Popup from '@/components/Popup.vue';
import EditTask from './components/modals/EditTask.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import Loading from '@/components/Loading.vue';
import TaskCard from './components/TaskCard.vue';

const router = useRouter()
const route = useRoute()

const tasks = ref([])

const showCreateTaskModal = ref(false)
const isLoading = ref(false)

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)
const practicants = ref([])

const showEditModal = ref(false)
const taskToEdit = ref(null)

const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const course = ref(null)

const navbarItems = computed(() => {
    if (!course.value) return [];

    return [
        { name: 'Практиканты', linkTo: `/courses/${course.value.id}/practicants` },
        { name: 'Задания', linkTo: `/courses/${course.value.id}/tasks` },
        { name: 'Оценки', linkTo: `/courses/${course.value.id}/marks` }
    ];
});

const goToWorks = (id) => {
    router.push(`/courses/${course.value.id}/works/${id}`)
}

const closeModal = () => {
    if (showCreateTaskModal.value) { showCreateTaskModal.value = false }
    if (showDeleteModal.value) { showDeleteModal.value = false }
    if (showEditModal.value) { showEditModal.value = false }
}

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

const openCreateTaskModal = () => {
    showCreateTaskModal.value = true
}

const openEditModal = (task) => {
    taskToEdit.value = task
    showEditModal.value = true
}

const openDeleteModal = (task) => {
    showDeleteModal.value = true
    taskToDelete.value = task
}

const fetchCourse = async () => {
    course.value = await getCourse(route.params.courseId)
}

const fetchTasks = async () => {
    try {
        isLoading.value = true
        tasks.value = await getTasksByCourse(course.value.id)
        console.log(tasks.value)
    } catch (err) { console.log(err) }
    finally {
        isLoading.value = false
    }
}

const deleteTask = async (id) => {
    try {
        isLoading.value = true
        closeModal()
        await apiDeleteTask(id)
        await fetchTasks()
        popupText.value = 'Задание удалено'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    }
    catch (err) {
        console.log(err)
        await fetchTasks()
        popupText.value = 'Не удалось удалить задание'
        showPopup.value = true
        isSuccess.value = false
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    }
    finally { isLoading.value = false }
}

const createTask = async (task) => {
    try {
        isLoading.value = true
        closeModal()

        task = { ...task, course_id: course.value.id }
        await apiCreateTask(task)

        await fetchTasks()

        popupText.value = 'Задание успешно создано'
        showPopup.value = true
        isSuccess.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    } catch (err) {
        console.log(err)
        popupText.value = 'Не удалось создать задание'
        showPopup.value = true
        isSuccess.value = false
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    } finally {
        isLoading.value = false
    }
}

const editTask = async (updatedTask) => {
    try {
        isLoading.value = true;
        closeModal();
        await updateTask(updatedTask.id, updatedTask)
        await fetchTasks()

        popupText.value = 'Задание успешно изменено';
        showPopup.value = true;
        isSuccess.value = true;
        setTimeout(() => {
            showPopup.value = false;
        }, 5000);
    } catch (err) {
        console.log(err);
        popupText.value = 'Не удалось изменить задание';
        showPopup.value = true;
        isSuccess.value = false;
        setTimeout(() => {
            showPopup.value = false;
        }, 5000);
    } finally {
        isLoading.value = false;
    }
};

const fetchPracticants = async () => {
    try {
        isLoading.value = true
        practicants.value = await getPracticants(course.value.id)
    } catch (err) { console.log(err) }
    finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await fetchCourse()
    await fetchTasks()
    await fetchPracticants()
})
</script>

<style scoped lang="scss">
button.blue {
    margin-top: 15px;
}

.tasks {
    margin: 15px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>