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
                        action="Отменить" @update-mark="updateMark" @action-with-practicant="cancelTask" />

                </div>

                <div class="status" v-if="cancelled.length > 0">
                    <h3>Отменено</h3>
                    <PracticantRow v-for="practicant in cancelled" :key="practicant.id" :practicant="practicant"
                        @click="selectPracticant(practicant)" :task-id="task.id" :is-select="practicant.isSelect"
                        action="Назначить" @action-with-practicant="assignTask" />

                </div>
            </Card>
            <Card class="no-hover right">
                <div class="info">
                    <h2>{{ task.name }}</h2>
                    <h3 v-html="task.text"></h3>
                    <p class="deadline">{{ format(task.until, 'short') }}</p>
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
        <Loading v-else />
    </Layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { format } from '@formkit/tempo';
import { getTask, completeTask, cancelTask as apiCancelTask, assignTask as apiAssignTask } from '@/api/modules/tasks.api';

import Layout from '@/layouts/Layout.vue';
import Card from '@/components/Card.vue';
import PracticantRow from './components/PracticantRow.vue';
import SelectedPracticant from './components/SelectedPracticant.vue';
import Loading from '@/components/Loading.vue';

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

const cancelTask = async (taskId, userId) => {
    try {
        await apiCancelTask(taskId, userId);
        const practicant = allPracticants.value.find(p => p.id === userId);
        if (practicant) {
            practicant.cancelled = 1;
            practicant.done = 0;
            practicant.mark = null;
        }
        updateTaskStatuse();
    } catch (err) {
        console.error("Ошибка при отмене задания:", err);
    }
};

const updateTaskStatuse = () => {
    assigned.value = [];
    cancelled.value = [];
    done.value = [];

    allPracticants.value.forEach(pr => {
        if (pr.cancelled === 1) {
            cancelled.value.push(pr);
        } else if (pr.done === 1 && pr.mark !== null) {
            done.value.push(pr);
        } else {
            assigned.value.push(pr);
        }
    });
};

const assignTask = async (taskId, userId) => {
    try {
        await apiAssignTask(taskId, userId)
        const practicant = allPracticants.value.find(p => p.id === userId);
        if (practicant) {
            practicant.cancelled = 0;
        }
        updateTaskStatuse()
    } catch (err) {
        console.error("Ошибка при назначении задания:", err);
    }
}

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
    allPracticants.value = task.value.students
    updateTaskStatuse()
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

                h3 {
                    margin: 15px 0;

                    * {
                        font-weight: 500 !important;

                    }
                }

                .deadline {
                    color: #6c6b6b;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
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

@media (max-width: 1200px) {
    .works {
        flex-direction: column;

        .left,
        .right {
            width: 100% !important;
        }
    }
}
</style>