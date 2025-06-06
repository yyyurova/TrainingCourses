<template>
    <Layout>
        <div v-if="task" class="works">
            <Card class="no-hover left">
                <h1>Работы практикантов</h1>
                <!-- <Card class="search-practicant no-hover">
                    <input type="text" placeholder="Иван Иванов">
                    <button class="icon">
                        <img src="/icons/x.svg" alt="">
                    </button>
                </Card> -->
                <div class="all-practicants-row" @click="selectAllPracticants">
                    <input type="checkbox" :checked="isAllSelected">
                    <span>Все практиканты</span>
                </div>

                <div class="status" v-if="assigned.length > 0">
                    <h3>Назначено</h3>
                    <PracticantRow v-for="practicant in assigned" :key="practicant.id" :practicant="practicant"
                        :task-id="task.id" @click="selectPracticant(practicant)" :is-select="practicant.isSelect"
                        @action-with-practicant="cancelTask" action="Отменить" @update-mark="updateMark" />
                </div>

                <div class="status" v-if="done.length > 0">
                    <h3>Сдано</h3>
                    <PracticantRow v-for="practicant in done" :key="practicant.id" :practicant="practicant"
                        :task-id="task.id" @click="selectPracticant(practicant)" :is-select="practicant.isSelect"
                        action="Отменить" @update-mark="updateMark" />
                    <!-- @action-with-practicant="cancelTask" -->
                </div>

                <div class="status" v-if="cancelled.length > 0">
                    <h3>Отменено</h3>
                    <PracticantRow v-for="practicant in cancelled" :key="practicant.id" :practicant="practicant"
                        @click="selectPracticant(practicant)" :is-select="practicant.isSelect" action="Назначить" />
                    <!-- @action-with-practicant="assignTask" -->
                </div>
            </Card>
            <Card class="no-hover right">
                <div class="info">
                    <h3 class="title">{{ task.title }}</h3>
                    <p class="deadline">{{ format(task.deadline, 'short') }}</p>
                </div>

                <div v-if="selectedPracticants.length === 0" class="no-selected-student">
                    <h2>Выберите практиканта</h2>
                    <p>Для просмотра выполненного задания</p>
                </div>

                <div v-if="selectedPracticants.length > 0" class="selected">
                    <SelectedPracticant v-for="practicant in selectedPracticants" :key="practicant.id"
                        :practicant="practicant" @delete="deleteFromSelected" />
                </div>
            </Card>
        </div>
    </Layout>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { format } from '@formkit/tempo';
import { getTask, completeTask } from '@/api/modules/tasks.api';

import Layout from '@/layouts/Layout.vue';
import Card from '@/components/Card.vue';
import PracticantRow from './components/PracticantRow.vue';
import SelectedPracticant from './components/SelectedPracticant.vue';

const task = ref(null)

const route = useRoute()

const isAllSelected = ref(false)

const selectedPracticants = ref([])

const allPracticants = ref([])
const assigned = ref([])
const done = ref([])
const cancelled = ref([])

const deleteFromSelected = (practicant) => {
    selectedPracticants.value = selectedPracticants.value.filter(pr => pr.id !== practicant.id)
    practicant.isSelect = false
}

const selectPracticant = (practicant) => {
    const practicantToSelect = allPracticants.value.find(pr => pr.id === practicant.id);

    if (practicantToSelect) {
        practicantToSelect.isSelect = !practicantToSelect.isSelect;

        if (practicantToSelect.isSelect) {
            selectedPracticants.value.push(practicantToSelect);
        } else {
            selectedPracticants.value = selectedPracticants.value.filter(
                pr => pr.id !== practicantToSelect.id
            );
        }
    }
}

const selectAllPracticants = () => {
    isAllSelected.value = !isAllSelected.value
    allPracticants.value.map(pr => {
        selectPracticant(pr)
    })
}

// const cancelTask = async (id) => {
//     try {
//         if (!task.value.cancelled.includes(id)) {
//             task.value.cancelled.push(id);
//             updateTaskStatuse();

//             const updatedCourse = {
//                 ...course.value,
//                 tasks: course.value.tasks.map(t =>
//                     t.id === task.value.id ? task.value : t
//                 )
//             };

//             await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${course.value.id}`, {
//                 tasks: updatedCourse.tasks
//             });
//         }
//     } catch (err) {
//         console.error("Ошибка при отмене задания:", err);
//         task.value.cancelled = task.value.cancelled.filter(c => c !== id);
//         updateTaskStatuse();
//     }
// }

// const assignTask = async (id) => {
//     try {
//         task.value.cancelled = task.value.cancelled.filter(c => c !== id);
//         updateTaskStatuse();

//         const updatedCourse = {
//             ...course.value,
//             tasks: course.value.tasks.map(t =>
//                 t.id === task.value.id ? task.value : t
//             )
//         };

//         await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${course.value.id}`, {
//             tasks: updatedCourse.tasks
//         });
//     } catch (err) {
//         console.error("Ошибка при назначении задания:", err);
//         task.value.cancelled.push(id);
//         updateTaskStatuse();
//     }
// }

const updateMark = async (taskId, practicantId, mark) => {
    try {
        await completeTask(taskId, practicantId, mark)
        await fetchTask()
    } catch (err) {
        console.error("Ошибка при обновлении оценки:", err);
    }
}

const fetchTask = async () => {
    task.value = await getTask(route.params.taskId)
    console.log(task.value)
    allPracticants.value = task.value.students
    updateTaskStatuse()
}

const updateTaskStatuse = () => {
    assigned.value = []
    cancelled.value = []
    done.value = []

    allPracticants.value.map(pr => {
        if (pr.mark === null || pr.mark === 0) {
            assigned.value.push(pr)
        } else if (pr.done === 1) {
            done.value.push(pr)
        }
        // else if (task.value.cancelled.includes(pr.id)) {
        //     cancelled.value.push(pr)
        // }
    })
}

onMounted(async () => {
    await fetchTask()
})
</script>

<style scoped lang="scss">
.works {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    h3 {
        font-weight: 600;
        font-size: 24px;
        line-height: 28px;
        letter-spacing: 1px;
    }

    .card {
        height: fit-content;
        display: flex;
        flex-direction: column;
        gap: 7px;

        &.left {
            width: calc(40% - 5px);
        }

        &.right {
            padding: 0;
            flex: 1;

            .info {
                padding: 20px;

                .deadline {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    vertical-align: middle;
                }
            }

            .no-selected-student {
                margin: 40px 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: center;

                h2 {
                    font-weight: 600;
                    font-size: 36px;
                    line-height: 42px;
                    letter-spacing: 1px;
                    text-align: center;
                }

                p {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    text-align: center;
                }
            }

            .selected {
                width: 100%;
            }
        }

        &.search-practicant {
            gap: 7px;
            padding: 10px;
            width: 100%;
            flex-direction: row;
            align-items: center;

            input {
                padding: 5px;
                border: none;
                width: 100%;
            }
        }

        .all-practicants-row {
            cursor: pointer;
            padding: 5px;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .status {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
    }
}

@media (max-width: 930px) {
    .works {
        flex-direction: column;

        .left,
        .right {
            width: 100% !important;
        }
    }
}
</style>