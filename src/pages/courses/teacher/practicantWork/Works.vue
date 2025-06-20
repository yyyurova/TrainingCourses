<template>
    <Layout>
        <div v-if="task" class="works">
            <Card class="no-hover left">
                <h1>Работы практикантов</h1>

                <button class="blue" @click="submitMark" :disabled="!selectedPracticant || !localMark">
                    Проверить
                </button>

                <div class="status" v-if="assigned.length > 0">
                    <h3>Назначено</h3>
                    <PracticantRow :class="{ 'selected-practicant': selectedPracticant?.id === practicant.id }"
                        :selected-practicant="selectedPracticant" v-for="practicant in assigned" :key="practicant.id"
                        :practicant="practicant" :task-id="task.id" @click="selectPracticant(practicant)"
                        @action-with-practicant="cancelTask" action="Отменить"
                        v-model:practicant-mark="practicant.mark" />
                </div>

                <div class="status" v-if="done.length > 0">
                    <h3>Сдано</h3>
                    <PracticantRow :class="{ 'selected-practicant': selectedPracticant?.id === practicant.id }"
                        :selected-practicant="selectedPracticant" v-for="practicant in done" :key="practicant.id"
                        :practicant="practicant" :task-id="task.id" @click="selectPracticant(practicant)"
                        action="Отменить" @action-with-practicant="cancelTask"
                        v-model:practicant-mark="practicant.mark" />
                </div>

                <div class="status" v-if="cancelled.length > 0">
                    <h3>Отменено</h3>
                    <PracticantRow :class="{ 'selected-practicant': selectedPracticant?.id === practicant.id }"
                        :selected-practicant="selectedPracticant" v-for="practicant in cancelled" :key="practicant.id"
                        :practicant="practicant" @click="selectPracticant(practicant)" :task-id="task.id"
                        action="Назначить" @action-with-practicant="assignTask"
                        v-model:practicant-mark="practicant.mark" />
                </div>
            </Card>

            <Card class="no-hover right">
                <div class="info">
                    <h2>{{ task.name }}</h2>
                    <h3 v-html="task.text"></h3>
                    <p class="deadline">{{ format(task.until, 'short') }}</p>
                </div>

                <div v-if="!selectedPracticant" class="no-selected-student">
                    <h2>Выберите практиканта</h2>
                    <p>Для просмотра выполненного задания</p>
                </div>

                <SelectedPracticant v-if="selectedPracticant" :practicant="selectedPracticant" v-model:mark="localMark"
                    :taskId="task.id" />
            </Card>
        </div>

        <Loading v-else />
        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :isSuccess="isSuccess" />
    </Layout>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import { format } from '@formkit/tempo';
import { getTask, completeTask, cancelTask as apiCancelTask, assignTask as apiAssignTask } from '@/api/modules/tasks.api';

import Layout from '@/layouts/Layout.vue';
import Card from '@/components/Card.vue';
import PracticantRow from './components/PracticantRow.vue';
import SelectedPracticant from './components/SelectedPracticant.vue';
import Loading from '@/components/Loading.vue';
import Popup from '@/components/Popup.vue';

const task = ref(null)

const route = useRoute()

const localMark = ref(null);
const selectedPracticant = ref(null);

const allPracticants = ref([])
const assigned = ref([])
const done = ref([])
const cancelled = ref([])

const showPopup = ref(false);
const popupText = ref('');
const isSuccess = ref(true);

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const closePopup = () => {
    showPopup.value = false
}

const selectPracticant = (practicant) => {
    selectedPracticant.value = practicant;
    localMark.value = practicant.mark || null;
};

const cancelTask = async (taskId, userId) => {
    try {
        await apiCancelTask(taskId, userId);
        showMessage('Задание отменено', true)
        const practicant = allPracticants.value.find(p => p.id === userId);
        if (practicant) {
            practicant.cancelled = 1;
            practicant.done = 0;
            practicant.mark = null;
        }
        updateTaskStatuse();
    } catch (err) {
        showMessage('Ошибка при отмене задания', false)
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
        showMessage('Задание назначено', true)
        const practicant = allPracticants.value.find(p => p.id === userId);
        if (practicant) {
            practicant.cancelled = 0;
        }
        updateTaskStatuse()
    } catch (err) {
        showMessage('Ошибка при назначении задания', false)
        console.error("Ошибка при назначении задания:", err);
    }
}

const submitMark = async () => {
    if (!selectedPracticant.value || !localMark.value) return;

    const markValue = Number(localMark.value);
    if (markValue < 1 || markValue > 10) {
        showMessage('Оценка должна быть от 1 до 10', false);
        return;
    }

    try {
        await completeTask(task.value.id, selectedPracticant.value.id, markValue);
        showMessage('Оценка сохранена', true);
        await fetchTask();
    } catch (err) {
        showMessage('Произошла ошибка при сохранении оценки', false);
        console.error("Ошибка при сохранении оценки:", err);
    }
};

const fetchTask = async () => {
    task.value = await getTask(route.params.taskId)
    allPracticants.value = task.value.students
    updateTaskStatuse()
}

onMounted(async () => {
    await fetchTask()
})

provide('selectedPracticant', selectedPracticant)
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

            padding: 20px 0;

            h1 {
                padding: 0 20px
            }

            button.blue {
                margin: 0 20px;

                &:disabled {
                    background-color: #ebebeb;
                    color: #969696;
                }
            }
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

            h3 {
                padding: 0 20px
            }

            .selected-practicant {
                background-color: #E9F2FF;
            }
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