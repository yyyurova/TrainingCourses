<template>
    <!-- <Layout :on-create-task="openCreateTaskModal"> -->
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
                :practicantId="route.params.practicantId" @edit="openEditModal(task)" />
        </div>

        <Loading v-if="isLoading" />
        <div v-if="tasks.length === 0 && !isLoading" class="no-items">
            <p>У практиканта нет заданий</p>
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
import { useRoute } from 'vue-router';
import { checkOverdueDeadline } from '@/utils/utils';
import { deleteTask as apiDeleteTask, updateTask } from '@/api/modules/tasks.api';
import { getPracticantTasks } from '@/api/modules/curarorStudents.api';

import Layout from '@/layouts/Layout.vue';
import TaskCard from '../components/TaskCard.vue';
import Loading from '@/components/Loading.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';
import Popup from '@/components/Popup.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';
import EditTask from '../components/modals/EditTask.vue';

const course = ref(null)
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

const closeModal = () => {
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

const openDeleteModal = (task) => {
    showDeleteModal.value = true
    taskToDelete.value = task
}

const fetchData = async () => {
    try {
        isLoading.value = true

        practicant.value = { name: localStorage.getItem('practicantName'), image: localStorage.getItem('practicantImage') }
        tasks.value = await getPracticantTasks(route.params.courseId, route.params.practicantId)
        console.log(tasks.value)

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
        popupText.value = 'Задание удалено'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    }
    catch (err) {
        console.log(err)
        await fetchData()
        popupText.value = 'Не удалось удалить задание'
        showPopup.value = true
        isSuccess.value = false
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    }
    finally { isLoading.value = false }
}

const editTask = async (updatedTask) => {
    try {
        isLoading.value = true;
        closeModal();
        await updateTask(updatedTask.id, updatedTask)
        await fetchData()

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

// const createTask = async (task) => {
//     try {
//         isLoading.value = true
//         closeModal()

//         const { data: courses } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses?teacher=${mockUser.id}`);
//         const course = courses[0]

//         const newId = Math.max(...course.tasks.map(t => t.id), 0) + 1

//         const newTask = {
//             id: newId,
//             ...task
//         }

//         const updatedTasks = [...course.tasks, newTask]

//         await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${course.id}`, {
//             tasks: updatedTasks
//         })

//         tasks.value = updatedTasks

//         popupText.value = 'Задание успешно создано'
//         showPopup.value = true
//         isSuccess.value = true
//         setTimeout(() => {
//             showPopup.value = false
//         }, 5000)
//     } catch (err) {
//         console.log(err)
//         popupText.value = 'Не удалось создать задание'
//         showPopup.value = true
//         isSuccess.value = false
//         setTimeout(() => {
//             showPopup.value = false
//         }, 5000)
//     } finally {
//         isLoading.value = false
//     }
// }

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

// const fetchPracticants = async () => {
//     try {

//         const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users?role=student`);
//         allPraricants.value = data
//     } catch (err) { console.log(err) }
//     finally {
//         isLoading.value = false
//     }
// }

onMounted(async () => {
    await fetchData()
    // await fetchPracticants()
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
</style>