<template>
    <div v-auto-animate class="table-container">
        <table>
            <thead>
                <tr>
                    <th class="id">
                        <span>ID</span>
                    </th>
                    <th class="name">
                        <p>
                            <span> Имя и Фамилия</span>
                            <img src="/icons/arrow.svg" alt="">
                        </p>
                    </th>
                    <th class="email">
                        <p>
                            <span>Электронная почта</span>
                            <img src="/icons/arrow.svg" alt="">
                        </p>
                    </th>
                    <th class="status">
                        <p>
                            <span>Статус</span>
                            <img src="/icons/arrow.svg" alt="">
                        </p>
                    </th>
                    <th class="role">
                        <p>
                            <span>Роль</span>
                            <img src="/icons/arrow.svg" alt="">
                        </p>
                    </th>
                    <th class="date">
                        <p>
                            <span>Дата создания</span>
                            <img src="/icons/arrow.svg" alt="">
                        </p>
                    </th>
                    <th class="actions"><span>Действия</span></th>
                </tr>
            </thead>
            <tbody v-if="!isLoading">
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <p :style="{ backgroundColor: statusBackgrounds[user.status] }">{{ user.status }}</p>
                    </td>
                    <td>
                        {{ user.status === 'Доступ не одобрен' || user.status === 'Новый пользователь' ? '-' :
                            translateRole(user.role)
                        }}
                    </td>
                    <td>{{ format(user.date, { date: 'long', time: 'short' }) }}</td>
                    <td>
                        <div class="action-buttons">
                            <button :class="button.class" @click="handleAction(button.class, user)" class="icon"
                                v-for="(button, index) in actionButtons[user.status]" :key="index"><img
                                    :src="button.src" alt=""></button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { format } from "@formkit/tempo"
import { translateRole } from "@/utils/utils";

defineProps({
    users: Array,
    isLoading: Boolean
})

const statusBackgrounds = {
    'Доступ одобрен': '#007843',
    'Доступ не одобрен': '#CD3232',
    'Новый пользователь': '#513DEB'
}

const actionButtons = {
    'Доступ одобрен': [
        {
            src: '/icons/pen.svg', class: 'edit'
        },
        {
            src: '/icons/delete.svg', class: 'delete'
        }
    ],
    'Новый пользователь': [
        {
            src: '/icons/tick.svg', class: 'approve'
        },
        {
            src: '/icons/cross.svg', class: 'disapprove'
        }
    ],
    'Доступ не одобрен': [
        {
            src: '/icons/tick.svg', class: 'approve'
        },
        {
            src: '/icons/delete.svg', class: 'delete'
        }
    ],
}
const emit = defineEmits(['delete-user', 'disapprove-user', 'open-approve-modal']);

const handleAction = (actionType, user) => {
    switch (actionType) {
        case 'delete':
            emit('delete-user', user);
            break;
        // case 'edit':
        //     emit('edit-user', user);
        //     break;
        case 'approve':
            emit('open-approve-modal', user);
            break;
        case 'disapprove':
            emit('disapprove-user', user);
            break;
        default:
            console.warn('Unknown action type:', actionType);
    }
};
</script>

<style scoped lang="scss">
.table-container {
    width: 100%;
    overflow-x: auto;

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        padding: 0;
        table-layout: fixed;

        thead tr {
            border-bottom: 1px solid #D9D9D9;
        }

        th {
            &.id {
                width: 75px;
            }

            &.name {
                width: 220px;
            }

            &.email {
                width: 320px;
            }

            &.status {
                width: 200px;
            }

            &.role {
                width: 200px;
            }

            &.date {
                width: 250px;
            }

            &.actions {
                width: 200px;
            }

            text-align: left;
            padding: 5px 10px;
            line-height: 20px;
            letter-spacing: 0px;
            border-radius: 8px;

            &:hover {
                background-color: #E9F2FF;
            }

            p {
                display: flex;
                width: 100%;
                justify-content: flex-start;
                gap: 5px;
                align-items: center;

                &:has(img) {
                    cursor: pointer;
                }

            }
        }

        td {
            padding: 10px;
            word-wrap: break-word;
            line-height: 20px;
            letter-spacing: 0px;

            p {
                padding: 5px;
                width: 100%;
                border-radius: 4px;
                color: #F5F5F5;
                text-align: center;
                font-size: 14px;
            }
        }
    }
}
</style>