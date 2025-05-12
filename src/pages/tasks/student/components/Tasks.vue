<template>
    <div class="tasks">
        <RouterLink class="link" v-for="task in tasks" :key="task.id"
            :to="`/courses/${task.courseId}/tasks/${task.id}`">
            <Card>
                <img src="/icons/task.svg" alt="">
                <div class="text">
                    <p class="name-of-task">
                        {{ task.title }}
                    </p>
                    <p class="bottom-row">
                        <span :class="{ 'overdue': checkOverdueDeadline(task.deadline) && !task.mark }">
                            {{ format(task.deadline, { date: 'long' }) }}
                        </span>
                        <span v-if="task.mark" class="mark">Оценка: {{ task.mark }}</span>
                    </p>
                </div>
            </Card>
        </RouterLink>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';
import { checkOverdueDeadline } from '@/utils/utils';

import Card from '@/components/Card.vue';

defineProps({
    tasks: Array,
})
</script>


<style scoped lang="scss">
.tasks {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    .link {
        text-decoration: none;
        width: fit-content;

        .card {
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

                .overdue {
                    color: #CD3232 !important;
                }
            }
        }
    }
}
</style>