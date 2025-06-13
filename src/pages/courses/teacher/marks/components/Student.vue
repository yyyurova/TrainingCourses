<script setup>
import { computed, ref } from 'vue';
import { format } from '@formkit/tempo';
import { checkOverdueDeadline } from '@/utils/utils';
import AvatarLetter from '@/components/AvatarLetter.vue';

const isOpen = ref(false);
const props = defineProps({
    student: Object,
});

const emit = defineEmits(['goToWorks']);

// Используем computed вместо мутации пропса
const filteredTasks = computed(() =>
    props.student.tasks.filter(t => t.mark !== null)
);

const goToWorks = (taskId, event) => {
    event.stopPropagation();
    emit('goToWorks', taskId);
};

const toggleInfo = () => {
    isOpen.value = !isOpen.value;
};

const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
</script>

<template>
    <div class="student" @click="toggleInfo">
        <div class="row">
            <img v-if="student.avatar" :src="student.avatar" alt="">
            <AvatarLetter v-else :name="student.name" />
            <p>{{ student.name }}</p>
            <button class="icon">
                <img src="/icons/arrow.svg" :class="isOpen ? 'arrow-down' : 'arrow-right'" alt="">
            </button>
        </div>
        <!-- Используем filteredTasks и добавляем класс для анимации -->
        <div :class="['table-container', { open: isOpen }]" v-if="isOpen">
            <table>
                <thead>
                    <tr>
                        <th class="task-col">Задание</th>
                        <th class="deadline-col">Срок сдачи</th>
                        <th class="mark-col">Оценка</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(task, index) in filteredTasks" :key="index" @click="goToWorks(task.taskId, $event)">
                        <td class="title">{{ truncateText(task.name, 70) }}</td>
                        <td class="deadline">{{ format(task.until, 'medium') }}</td>
                        <td class="mark">
                            <p>{{ task.mark }}</p>
                            <p v-if="checkOverdueDeadline(task.until)" class="overdue">Пропущен срок сдачи</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.student {
    width: 100%;
    overflow: hidden;

    .row {
        cursor: pointer;
        padding: 15px;
        display: flex;
        gap: 10px;
        align-items: center;

        p {
            flex: 1;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
        }

        img {
            width: 36px;
            height: auto;
        }

        button {
            width: 32px;
            height: 32px;

            img {
                width: 100%;
                height: 100%;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        }
    }

    .table-container {
        display: grid;
        grid-template-rows: 0fr;
        transition:
            grid-template-rows 0.3s ease-out,
            padding 0.3s ease-out;
        padding: 0 15px;
        overflow: hidden;

        &.open {
            grid-template-rows: 1fr;
            padding: 0 15px 15px;
        }

        table {
            min-height: 0;
            width: 100%;
            border-collapse: collapse;
            background: white;
            margin-top: -1px;

            thead {
                background-color: #EFEFEF;

                tr:first-child th:first-child {
                    border-top-left-radius: 8px;
                }

                tr:first-child th:last-child {
                    border-top-right-radius: 8px;
                }

                th {
                    padding: 12px 10px;
                    font-weight: 600;
                    font-size: 15px;
                    border: 1px solid #eee;

                    &:first-child {
                        border-left: none;
                    }

                    &:last-child {
                        border-right: none;
                    }

                    &.task-col {
                        width: 50%;
                    }

                    &.deadline-col {
                        width: 20%;
                    }

                    &.mark-col {
                        width: 30%;
                    }
                }
            }

            td {
                padding: 12px 10px;
                vertical-align: top;
                border: 1px solid #eee;

                &:first-child {
                    border-left: none;
                }

                &:last-child {
                    border-right: none;
                }

                &.title {
                    font-weight: 700;
                    font-size: 15px;
                    line-height: 18px;
                }

                &.deadline {
                    color: #787878;
                    font-weight: 700;
                    text-align: center;
                }

                &.mark p {
                    font-weight: 700;
                    text-align: center;
                }
            }

            tr {
                cursor: pointer;
            }

            tr:last-child td {
                border-bottom: none;
            }
        }
    }
}
</style>