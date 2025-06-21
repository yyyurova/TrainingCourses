<template>
    <Layout>
        <div v-if="practicant" class="header">
            <img v-if="practicant.image" :src="practicant.image" alt="">
            <AvatarLetter v-else :name="practicant.name" />
            <h1>{{ practicant.name }}</h1>
        </div>

        <select ref="taskFilter" @change="filterTasks">
            <option value="all" selected>Все задания</option>
            <option value="overdue">Пропущен срок сдачи</option>
            <option value="done">Сдано</option>
        </select>

        <div class="tasks" v-if="tasks && tasks.length > 0 && !isLoading">
            <TaskCard v-for="task in tasks" :key="task.id" :task="task" @delete="openDeleteModal(task)"
                @click="goToWorks(task.id)" :practicantId="route.params.practicantId" @edit="openEditModal(task)" />
        </div>

        <Loading v-if="isLoading" />

        <div v-if="nothingFoundMessage && tasks.length === 0 && !isLoading" class="no-items">
            <p>{{ nothingFoundMessage }}</p>
        </div>

        <Popup v-if="showPopup" :text="popupText" :is-success="isSuccess" @close-popup="closePopup" />

        <ConfirmDelete v-if="showDeleteModal" @confirm="deleteTask(taskToDelete.id)" @cancel="closeModal"
            question="Удалить задание?" right-button-text="Удалить"
            text="Оценки, комментарии и информация о задании будут удалены" />

        <EditTask v-if="showEditModal" :task="taskToEdit" @cancel="closeModal" @save="editTask" />
    </Layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { checkOverdueDeadline } from '@/utils/utils';
import { deleteTask as apiDeleteTask, updateTask } from '@/api/modules/tasks';
import { getPracticantTasks } from '@/api/modules/curarorStudents';

import Layout from '@/layouts/Layout.vue';
import TaskCard from '../components/TaskCard.vue';
import Loading from '@/components/Loading.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';
import Popup from '@/components/Popup.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import EditTask from '../components/modals/EditTask.vue';

const practicant = ref(null)
const tasks = ref([])
const taskFilter = ref(null)
const originalTasks = ref([])

const nothingFoundMessage = ref('')

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const showEditModal = ref(false)
const taskToEdit = ref(null)

const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const isLoading = ref(false)

const route = useRoute()
const router = useRouter()

const closeModal = () => {
    if (showDeleteModal.value) { showDeleteModal.value = false }
    if (showEditModal.value) { showEditModal.value = false }
}

const goToWorks = (id) => {
    router.push(`/courses/${route.params.courseId}/works/${id}`)
}

const openEditModal = (task) => {
    taskToEdit.value = task
    showEditModal.value = true
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

const openDeleteModal = (task) => {
    showDeleteModal.value = true
    taskToDelete.value = task
}

const fetchData = async () => {
    try {
        isLoading.value = true

        practicant.value = { name: localStorage.getItem('practicantName'), image: localStorage.getItem('practicantImage') }
        tasks.value = await getPracticantTasks(route.params.courseId, route.params.practicantId)
        originalTasks.value = tasks.value

        if (tasks.value && tasks.value.students) {
            practicant.value = tasks.value[0].students.find(s => s.id == route.params.practicantId)
        }
    }
    finally {
        isLoading.value = false
    }
}

const deleteTask = async (id) => {
    try {
        isLoading.value = true
        closeModal()
        await apiDeleteTask(id)
        await fetchData()

        showMessage('Задание удалено', true)
    }
    catch (err) {
        console.log(err)
        await fetchData()
        showMessage('Не удалось удалить задание', false)
    }
    finally { isLoading.value = false }
}

const editTask = async (updatedTask) => {
    try {
        isLoading.value = true;
        closeModal();
        await updateTask(updatedTask.id, updatedTask, route.params.courseId)
        await fetchData()

        showMessage('Задание успешно изменено', true)
    } catch (err) {
        console.log(err);
        showMessage('Не удалось изменить задание', false)
    } finally {
        isLoading.value = false;
    }
};

const filterTasks = () => {
    const practicantId = parseInt(route.params.practicantId);

    switch (taskFilter.value.value) {
        case 'all':
            nothingFoundMessage.value = ''
            tasks.value = originalTasks.value
            if (tasks.value.length === 0) {
                nothingFoundMessage.value = 'У данного учащегося нет заданий.'
            }
            break
        case 'overdue':
            nothingFoundMessage.value = ''
            tasks.value = originalTasks.value.filter(task => checkOverdueDeadline(task.until))
            if (tasks.value.length === 0) {
                nothingFoundMessage.value = 'Этот учащийся не просрочил ни одного задания'
            }
            break
        case 'done':
            nothingFoundMessage.value = ''
            tasks.value = originalTasks.value.filter(task => {
                if (!task.students || !Array.isArray(task.students)) return false;

                const student = task.students.find(s => s.id === practicantId);
                return student && student.done === 1;
            });

            if (tasks.value.length === 0) {
                nothingFoundMessage.value = 'Этот учащийся пока ничего не сдавал';
            }
            break;
    }
}

onMounted(async () => {
    await fetchData()
})
</script>

<style scoped lang="scss">
h1 {
    word-break: break-all;
    flex: 1
}

.header {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
        width: 42px;
        height: auto;
        border-radius: 4px;
    }
}

select {
    width: calc(50% - 5px);
}

.tasks {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>