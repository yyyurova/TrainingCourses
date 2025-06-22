<template>
    <Layout>
        <h1>Пользователи</h1>

        <button class="blue" @click="openCreateUserModal">
            <span>Создать пользователя</span>
            <img src="/icons/actions/plus.svg" alt="">
        </button>

        <UsersTable :users="users" :isLoading="isLoading" @delete-user="openDeleteModal" @edit-user="openEditModal"
            @disapprove-user="openDisapproveModal" @open-approve-modal="openApproveModal" @filter="handleFilter" />

        <NoUsers v-if="users.length === 0 && !isLoading" />

        <Loading v-if="isLoading || getUserRole() === null" />

        <Pagination v-else :totalItems="totalItems" :currentPage="currentPage" :perPage="defaultPerPage"
            @update:currentPage="updateCurrentPage" />

        <ConfirmDelete v-if="showConfirmModal" :question="modalConfig.question" :text="modalConfig.text"
            :rightButtonText="modalConfig.rightButtonText" @confirm="modalConfig.onConfirm" @cancel="closeModal" />

        <SelectRole v-if="showSelectModal" @save="selectRole" @cancel="closeModal" />

        <CreateUser v-if="showCreateModal" @cancel="closeModal" @create="handleCreateUser" />

        <EditUser v-if="showEditModal" :user="selectedUser" @cancel="closeModal"
            @edit="(newInfo) => handleEditUser(selectedUser, newInfo)" />

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :is-success="isSuccess" />

    </Layout>
</template>
<script setup>
import { ref, onMounted, watch, provide } from 'vue'

import { getUserRole } from '@/utils/auth'

import { getUsers, deleteUser as apiDeleteUser, editUser, createUser } from '@/api/modules/adminUsers'

import Layout from '../../layouts/Layout.vue'

import UsersTable from '../users/components/UsersTable.vue'
import Pagination from '../users/components/Pagination.vue'
import Loading from '../../components/Loading.vue'
import NoUsers from './components/NoUsers.vue'

import ConfirmDelete from '../../components/modals/ConfirmDelete.vue'
import SelectRole from './modals/SelectRole.vue'
import CreateUser from './modals/CreateUser.vue'
import EditUser from './modals/EditUser.vue'
import Popup from '@/components/Popup.vue'

const defaultPerPage = parseInt(import.meta.env.VITE_PAGINATION_LIMIT)

const users = ref([])

const isLoading = ref(false);

const scrollPosition = ref(0)

const currentPage = ref(1);
const totalItems = ref(0);

const showConfirmModal = ref(false);
const showSelectModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)

const showPopup = ref(false)
const popupText = ref('')
const isSuccess = ref(true)

const selectedUser = ref(null);

const saveScrollPosition = () => {
    scrollPosition.value = window.scrollY || document.documentElement.scrollTop;
};

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const modalConfig = ref({
    question: '',
    text: '',
    rightButtonText: '',
    onConfirm: () => { }
})

const fetchUsers = async () => {
    try {
        saveScrollPosition();

        const params = {
            page: currentPage.value,
            per_page: defaultPerPage
        };

        if (filters.value.role) params.role = filters.value.role;
        if (filters.value.status) params.status = filters.value.status;
        if (filters.value.email) params.email = filters.value.email;
        if (filters.value.name) params.name = filters.value.name;

        isLoading.value = true;

        const response = await getUsers(params);
        users.value = response.data;
        totalItems.value = response.meta.total;
        currentPage.value = response.meta.current_page
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        isLoading.value = false;
    }
};

const updateCurrentPage = (newPage) => {
    currentPage.value = newPage
    fetchUsers()
}

const openModal = (config) => {
    modalConfig.value = {
        question: config.question,
        text: config.text,
        rightButtonText: config.rightButtonText,
        onConfirm: config.onConfirm
    }
    showConfirmModal.value = true
}

const closeModal = () => {
    if (showConfirmModal.value) { showConfirmModal.value = false }
    if (showSelectModal.value) { showSelectModal.value = false }
    if (showCreateModal.value) { showCreateModal.value = false }
    if (showEditModal.value) { showEditModal.value = false }
}

const openDeleteModal = (user) => {
    openModal({
        question: 'Удалить пользователя?',
        text: 'Вся информация о данном пользователе будет удалена.',
        rightButtonText: 'Удалить',
        onConfirm: () => deleteUser(user)
    })
}

const openDisapproveModal = (user) => {
    openModal({
        question: 'Не одобрять доступ пользователю?',
        text: '',
        rightButtonText: 'Не одобрять',
        onConfirm: () => disapproveUser(user)
    })
}

const openCreateUserModal = () => {
    showCreateModal.value = true
}

const deleteUser = async (user) => {
    if (!user) return
    closeModal()
    try {
        await apiDeleteUser(user.id)
        await fetchUsers()

        showMessage(`Пользователь удален`, true)
    } catch (error) {
        console.error('Error deleting user:', error)
    }
}

const disapproveUser = async (user) => {
    if (!user) return
    closeModal()
    try {
        isLoading.value = true
        await editUser(user.id, {
            ...user,
            status: 'rejected'
        })

        await fetchUsers()

        showMessage(`Доступ для пользователя ${user.name} отклонен`, true)
    } catch (error) {
        console.error('Error disapproving user:', error)
        showMessage('Не удалось сохранить изменения', false)
    } finally {
        isLoading.value = false
    }
}

const openApproveModal = (user) => {
    selectedUser.value = user;
    showSelectModal.value = true;
};

const selectRole = async (role) => {
    if (!selectedUser.value || !role) return;
    closeModal();
    try {
        await editUser(selectedUser.value.id, {
            ...selectedUser.value,
            role: role,
            status: 'approved'
        })
        await fetchUsers();

        showMessage('Роль пользователя обновлена', true)
    } catch (error) {
        console.error('Error approving user:', error);
        showMessage('Не удалось обновить роль пользователя', false)
    } finally {
        selectedUser.value = null;
    }
};

const filters = ref({
    role: null,
    status: null,
    email: null,
    name: null
});

const handleFilter = ({ type, value }) => {
    filters.value[type] = value;
};

const handleCreateUser = async (user) => {
    try {
        closeModal()

        await createUser({
            name: user.name,
            email: user.email,
            status: user.status,
            role: user.role,
            date: new Date()
        })

        await fetchUsers()

        showMessage('Пользователь создан', true)
    } catch (err) {
        console.log(err)
        showMessage('Ошибка при создании пользователя', false)
    }
}

const openEditModal = (user) => {
    selectedUser.value = user;
    showEditModal.value = true;
};

const handleEditUser = async (user, newUser) => {
    try {
        closeModal()
        await editUser(user.id, newUser)
        await fetchUsers();

        showMessage('Изменения сохранены', true)
    } catch (error) {
        console.error('Error editing user:', error);
        showMessage('Не удалось сохранить изменения', false)
    }
};

const resetFilters = () => {
    filters.value.role = null;
    filters.value.status = null;
    filters.value.email = null;
    filters.value.name = null;
};

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

onMounted(async () => {
    isLoading.value = true
    setTimeout(async () => {
        await fetchUsers()
    }, 2000);
});

provide('filters', filters)
provide('users', users)
provide('resetFilters', resetFilters)

watch(
    () => filters.value,
    () => {
        currentPage.value = 1;
        fetchUsers();
    },
    { deep: true }
);
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}

@media (max-width:360px) {
    button.blue {
        width: 100%;
    }
}
</style>