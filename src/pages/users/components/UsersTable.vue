<template>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th class="id">
                        <span>ID</span>
                    </th>

                    <th class="name" @click.stop="toggleNameFilter">
                        <p>
                            <span> Имя и Фамилия</span>
                            <img class="arrow-up" src="/icons/arrow.svg" alt="">
                        </p>
                        <FilterByName v-if="showFilter.name" @filter="(value) => handleFilter('name', value)" />
                    </th>

                    <th class="email" @click.stop="toggleEmailFilter">
                        <p>
                            <span>Электронная почта</span>
                            <img class="arrow-up" src="/icons/arrow.svg" alt="">
                        </p>
                        <FilterByEmail v-if="showFilter.email" @filter="(value) => handleFilter('email', value)" />
                    </th>

                    <th class="status" @click.stop="toggleStatusFilter">
                        <p>
                            <span>Статус</span>
                            <img class="arrow-up" src="/icons/arrow.svg" alt="">
                        </p>
                        <FilterByStatus v-if="showFilter.status" @filter="(value) => handleFilter('status', value)" />
                    </th>

                    <th class="role" @click.stop="toggleRoleFilter">
                        <p>
                            <span>Роль</span>
                            <img class="arrow-up" src="/icons/arrow.svg" alt="">
                        </p>
                        <FilterByRole v-if="showFilter.role" @filter="(value) => handleFilter('role', value)" />
                    </th>

                    <th class="date">
                        <p>
                            <span>Дата создания</span>
                        </p>
                    </th>

                    <th class="actions"><span>Действия</span></th>
                </tr>
                <FilterRow />
            </thead>

            <tbody v-if="!isLoading">
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <p :style="{ backgroundColor: statusBackgrounds[user.status] }">{{ translateStatus(user.status)
                            }}</p>
                    </td>
                    <td>
                        {{ translateStatus(user.status) === 'Доступ не одобрен' || translateStatus(user.status) ===
                            'Новый пользователь' ? '-' :
                            translateRole(user.role)
                        }}
                    </td>
                    <td>{{ format(user.created_at, { date: 'long', time: 'short' }) }}</td>
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
import { onMounted, onUnmounted, reactive } from "vue";
import { format } from "@formkit/tempo"
import { translateRole, translateStatus } from "@/utils/utils";

import FilterByRole from "../modals/filter/FilterByRole.vue";
import FilterByStatus from "../modals/filter/FilterByStatus.vue";
import FilterByEmail from "../modals/filter/FilterByEmail.vue";
import FilterByName from "../modals/filter/FilterByName.vue";
import FilterRow from "./FilterRow.vue";

defineProps({
    users: Array,
    isLoading: Boolean
})

const showFilter = reactive({
    role: false,
    status: false,
    email: false,
    name: false
})

const toggleStatusFilter = (event) => {
    closeAllFilters();
    showFilter.status = !showFilter.status;
    toggleArrow(event);
}

const toggleRoleFilter = (event) => {
    closeAllFilters();
    showFilter.role = !showFilter.role;
    toggleArrow(event);
}

const toggleEmailFilter = (event) => {
    closeAllFilters();
    showFilter.email = !showFilter.email;
    toggleArrow(event);
}

const toggleNameFilter = (event) => {
    closeAllFilters();
    showFilter.name = !showFilter.name;
    toggleArrow(event);
}
const toggleArrow = (event) => {
    const img = event.currentTarget.querySelector('img');
    img?.classList.toggle('arrow-down');
    img?.classList.toggle('arrow-up')
};

const statusBackgrounds = {
    'approved': '#007843',
    'rejected': '#CD3232',
    'pending': '#513DEB'
}

const actionButtons = {
    'approved': [
        {
            src: '/icons/pen.svg', class: 'edit'
        },
        {
            src: '/icons/delete.svg', class: 'delete'
        }
    ],
    'pending': [
        {
            src: '/icons/tick.svg', class: 'approve'
        },
        {
            src: '/icons/cross.svg', class: 'disapprove'
        }
    ],
    'rejected': [
        {
            src: '/icons/tick.svg', class: 'approve'
        },
        {
            src: '/icons/delete.svg', class: 'delete'
        }
    ],
}

const emit = defineEmits(['delete-user', 'disapprove-user', 'open-approve-modal', 'filter', 'edit-user']);

const handleAction = (actionType, user) => {
    switch (actionType) {
        case 'delete':
            emit('delete-user', user);
            break;
        case 'edit':
            emit('edit-user', user);
            break;
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

const handleFilter = (type, value) => {
    if (type === 'name') {
        emit('filter', { type, value: value.length > 0 ? value : null });
    } else {
        emit('filter', { type, value });
    }
};

const handleClickOutside = (e) => {
    if (!e.target.closest('.filter-modal')) {
        Object.keys(showFilter).forEach(key => {
            showFilter[key] = false;
        });
        document.querySelectorAll('.arrow-down').forEach(arrow => {
            arrow.classList.add('arrow-up')
            arrow.classList.remove('arrow-down')
        })
    }
}

const closeAllFilters = () => {
    Object.keys(showFilter).forEach(key => {
        showFilter[key] = false;
    });

    document.querySelectorAll('.arrow-down').forEach(arrow => {
        arrow.classList.add('arrow-up');
        arrow.classList.remove('arrow-down');
    });
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped lang="scss">
.table-container {
    width: 100%;
    overflow-x: auto;
    z-index: 500;
    position: relative;
    overflow-y: visible;

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        padding: 0;
        table-layout: fixed;
        overflow: visible !important;

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

            position: relative;
            text-align: left;
            padding: 5px 10px;
            line-height: 20px;
            letter-spacing: 0px;
            border-radius: 8px;
            z-index: 500;
            overflow: visible;

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