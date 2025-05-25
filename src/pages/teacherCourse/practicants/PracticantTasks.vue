<template>
    <Layout :on-create-task="openCreateTaskModal">
        <div v-if="practicant" class="header">
            <img :src="practicant.avatar || '/avatar.png'" alt="">
            <h1>{{ practicant.name }}</h1>
        </div>
        <select ref="taskFilter" @change="filterTasks">
            <option value="all" selected>Все задания</option>
            <option value="overdue">Пропущен срок сдачи</option>
            <option value="done">Сдано</option>
        </select>

        <div class="tasks" v-if="tasks.length > 0 && !isLoading">
            <TaskCard v-for="task in tasks" :key="task.id" :task="task" @delete="openDeleteModal(task)"
                :practicantId="route.params.practicantId" @edit="openEditModal(task)" />
        </div>
        <Loading v-if="isLoading" />
        <div v-if="nothingFoundMessage && tasks.length === 0 && !isLoading" class="no-found-message">
            <h2> {{ nothingFoundMessage }}</h2>
        </div>
        <CreateTask v-if="showCreateTaskModal" @cancel="closeModal" @create="createTask" />
        <Popup v-if="showPopup" :text="popupText" :is-success="isSuccess" @close-popup="closePopup" />
        <ConfirmDelete v-if="showDeleteModal" @confirm="deleteTask(taskToDelete.id)" @cancel="closeModal"
            question="Удалить задание?" right-button-text="Удалить"
            text="Оценки, комментарии и информация о задании будут удалены" />
        <EditTask v-if="showEditModal" :task="taskToEdit" @cancel="closeModal" @save="editTask" />
    </Layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { checkOverdueDeadline } from '@/utils/utils';
import { mockUser } from '@/mocks/user';

import Layout from '@/layouts/Layout.vue';
import TaskCard from '../components/TaskCard.vue';
import Loading from '@/components/Loading.vue';
import CreateTask from '../components/modals/CreateTask.vue';
import Popup from '@/components/Popup.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import EditTask from '../components/modals/EditTask.vue';

const course = ref(null)
const practicant = ref(null)
const tasks = ref([])
const taskFilter = ref(null)
const originalTasks = ref([])

const nothingFoundMessage = ref('')

const showEditModal = ref(false)
const taskToEdit = ref(null)

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const isLoading = ref(false)
const showCreateTaskModal = ref(false)

const route = useRoute()

const closeModal = () => {
    if (showCreateTaskModal.value) { showCreateTaskModal.value = false }
    if (showDeleteModal.value) { showDeleteModal.value = false }
    if (showEditModal.value) { showEditModal.value = false }
}

const openEditModal = (task) => {
    taskToEdit.value = task
    showEditModal.value = true
}

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

const openCreateTaskModal = () => {
    showCreateTaskModal.value = true
}

const openDeleteModal = (task) => {
    showDeleteModal.value = true
    taskToDelete.value = task
}

const fetchData = async () => {
    try {
        isLoading.value = true
        const courseData = localStorage.getItem('course')
        course.value = courseData ? JSON.parse(courseData) : null

        if (!course.value) {
            console.error('Course not found in localStorage')
            return
        }

        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users/${route.params.practicantId}`);
        practicant.value = data

        tasks.value = course.value.tasks.filter(task =>
            Array.isArray(task.assignedTo) && task.assignedTo.includes(practicant.value.id)
        )
        originalTasks.value = tasks.value

        if (tasks.value.length === 0) {
            nothingFoundMessage.value = 'У данного учащегося нет заданий.'
        }

    } catch (err) { console.log(err) }
    finally {
        isLoading.value = false
    }
}

const deleteTask = async (taskId) => {
    try {
        isLoading.value = true;
        closeModal();

        const courseData = localStorage.getItem('course');
        const currentCourse = courseData ? JSON.parse(courseData) : null;

        if (!currentCourse) {
            throw new Error('Course not found');
        }

        const taskIndex = currentCourse.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new Error('Task not found');
        }

        const studentId = Number(route.params.practicantId);
        currentCourse.tasks[taskIndex].assignedTo = currentCourse.tasks[taskIndex].assignedTo.filter(id => id !== studentId);

        if (currentCourse.tasks[taskIndex].marks && currentCourse.tasks[taskIndex].marks[studentId]) {
            delete currentCourse.tasks[taskIndex].marks[studentId];
        }

        if (currentCourse.tasks[taskIndex].assignedTo.length === 0) {
            currentCourse.tasks = currentCourse.tasks.filter(t => t.id !== taskId);
        }

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${currentCourse.id}`, {
            tasks: currentCourse.tasks
        });

        // console.log(tasks.value)
        if (tasks.value.length === 0) {
            nothingFoundMessage.value = 'У данного учащегося нет заданий.'
        }

        localStorage.setItem('course', JSON.stringify(currentCourse));
        await fetchData();

        popupText.value = 'Задание удалено';
        showPopup.value = true;
        setTimeout(() => {
            showPopup.value = false;
        }, 5000);
    }
    catch (err) {
        console.error(err);
        popupText.value = 'Не удалось удалить задание';
        showPopup.value = true;
        isSuccess.value = false;
        setTimeout(() => {
            showPopup.value = false;
        }, 5000);
    }
    finally {
        isLoading.value = false;
    }
}

const editTask = async (updatedTask) => {
    try {
        isLoading.value = true;
        closeModal();

        const { data: courses } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses?teacher=${mockUser.id}`);
        const course = courses[0];

        const updatedTasks = course.tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        );

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${course.id}`, {
            tasks: updatedTasks
        });

        tasks.value = updatedTasks;

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

const createTask = async (task) => {
    try {
        isLoading.value = true
        closeModal()

        const { data: courses } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses?teacher=${mockUser.id}`);
        const course = courses[0]

        const newId = Math.max(...course.tasks.map(t => t.id), 0) + 1

        const newTask = {
            id: newId,
            ...task
        }

        const updatedTasks = [...course.tasks, newTask]

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${course.id}`, {
            tasks: updatedTasks
        })

        tasks.value = updatedTasks

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

const filterTasks = () => {
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
            tasks.value = originalTasks.value.filter(task => checkOverdueDeadline(task.deadline))
            if (tasks.value.length === 0) {
                nothingFoundMessage.value = 'Этот учащийся не просрочил ни одного задания'
            }
            break
        case 'done':
            nothingFoundMessage.value = ''
            tasks.value = originalTasks.value.filter(task =>
                task.marks &&
                Object.prototype.toString.call(task.marks) === '[object Object]' &&
                Object.values(task.marks).some(mark => mark != null)
            )
            if (tasks.value.length === 0) {
                nothingFoundMessage.value = 'Этот учащийся пока ничего не сдавал'
            }
            break
    }
}

onMounted(async () => {
    fetchData()
})
</script>

<style scoped lang="scss">
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

.no-found-message {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>