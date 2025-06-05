<template>
    <div class="tasks">
        <RouterLink class="link" v-for="task in tasks" :key="task.id" :to="`/tasks/${task.id}`">
            <Card>
                <img src="/icons/task.svg" alt="">
                <div class="text">
                    <p class="name-of-task">
                        {{ task.name }}
                    </p>
                    <p class="bottom-row">
                        <span :class="{ 'overdue': checkOverdueDeadline(task.until) && !task.mark }">
                            {{ format(task.until, { date: 'long' }) }}
                        </span>
                        <span v-if="task.mark" class="mark">Оценка: {{ task.mark }}</span>
                    </p>
                    <p class="course-name">Курс: {{ task.course.title }}</p>
                </div>
            </Card>
        </RouterLink>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';
import { checkOverdueDeadline } from '@/utils/utils';

import Card from '@/components/Card.vue';

const props = defineProps({
    tasks: Array,
})
</script>

<style scoped lang="scss">
.tasks {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;

    .link {
        text-decoration: none;
        width: fit-content;

        .card {
            width: 477px;
            display: flex;
            align-items: flex-start;
            flex-direction: row;
            gap: 10px;
            cursor: pointer;

            .text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 10px;

                .bottom-row {
                    display: flex;
                    gap: 15px;
                }

                .course-name {
                    font-size: 14px;
                    color: #969696;

                    // color: ;
                }

                p span {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                }

                .name-of-task {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;

                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}

@media (max-width:1280px) {
    .link {
        width: 49% !important;

        .card {
            width: 100% !important;
        }
    }
}

@media (max-width:768px) {
    .link {
        width: 100% !important;
    }
}
</style>