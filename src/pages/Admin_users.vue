<template>
    <Layout>
        <h1>Пользователи</h1>
        <button class="blue">
            <span>Создать пользователя</span>
            <img src="/icons/plus.svg" alt="">
        </button>
        <div class="table-container">
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
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <p :style="{ backgroundColor: statusBackgrounds[user.status] }">{{ user.status }}</p>
                        </td>
                        <td>
                            {{ user.status === 'Доступ не одобрен' || user.status === 'Новый пользователь' ? '-' :
                                user.role
                            }}
                        </td>
                        <td>{{ user.date }}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="icon" v-for="(button, index) in actionButtons[user.status]"
                                    :key="index"><img :src="button" alt=""></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Layout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import Layout from '../layouts/Layout.vue'

const users = ref([])

const fetchUsers = async () => {
    const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users`)
    users.value = data.map(obj => ({
        ...obj
    }))
}

const statusBackgrounds = {
    'Доступ одобрен': '#007843',
    'Доступ не одобрен': '#CD3232',
    'Новый пользователь': '#513DEB'
}

const actionButtons = {
    'Доступ одобрен': ['/icons/pen.svg', '/icons/delete.svg'],
    'Новый пользователь': ['/icons/tick.svg', '/icons/cross.svg'],
    'Доступ не одобрен': ['/icons/tick.svg', '/icons/delete.svg'],
}

onMounted(async () => {
    await fetchUsers()
})
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}

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