<template>
    <Layout>
        <h1>Пользователи</h1>
        <button class="blue">
            <span>Создать пользователя</span>
            <img src="/icons/plus.svg" alt="">
        </button>

        <UsersTable :users="users" :isLoading="isLoading" @delete-user="openDeleteModal"
            @disapprove-user="openDisapproveModal" @open-approve-modal="openApproveModal" />

        <Loading v-if="isLoading" />

        <Pagination v-else :totalItems="totalItems" :currentPage="currentPage"
            @update:currentPage="updateCurrentPage" />

        <ConfirmDelete v-if="showConfirmModal" :show="showConfirmModal" :question="modalConfig.question"
            :text="modalConfig.text" @confirm="modalConfig.onConfirm" @cancel="closeModal" />

        <SelectRole v-if="showSelectModal" @save="approveUser" @cancel="closeModal" />
    </Layout>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

import Layout from '../../layouts/Layout.vue'

import UsersTable from '../users/components/UsersTable.vue'
import Pagination from '../users/components/Pagination.vue'
import Loading from '../../components/Loading.vue'
import ConfirmDelete from '../../components/modals/ConfirmDelete.vue'
import SelectRole from './modals/SelectRole.vue'

const users = ref([])

const isLoading = ref(false);

const scrollPosition = ref(0)

const currentPage = ref(1);
const totalItems = ref(0);

const showConfirmModal = ref(false);

const showSelectModal = ref(false)

const selectedUser = ref(null);

const saveScrollPosition = () => {
    scrollPosition.value = window.scrollY || document.documentElement.scrollTop;
};

const modalConfig = ref({
    question: '',
    text: '',
    onConfirm: () => { }
})

const fetchUsers = async () => {
    try {
        saveScrollPosition()
        isLoading.value = true
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/users?page=${currentPage.value}`);

        users.value = data.items.map(obj => ({
            ...obj
        }));
        totalItems.value = data.meta.total_items;
        nextTick(() => {
            window.scrollTo(0, scrollPosition.value);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        isLoading.value = false
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
        onConfirm: config.onConfirm
    }
    showConfirmModal.value = true
}

const closeModal = () => {
    if (showConfirmModal.value) { showConfirmModal.value = false }
    if (showSelectModal.value) { showSelectModal.value = false }
}

const openDeleteModal = (user) => {
    openModal({
        question: 'Удалить пользователя?',
        text: 'Вся информация о данном пользователе будет удалена.',
        onConfirm: () => deleteUser(user)
    })
}

const openDisapproveModal = (user) => {
    openModal({
        question: 'Не одобрять доступ пользователю?',
        text: '',
        onConfirm: () => disapproveUser(user)
    })
}

const deleteUser = async (user) => {
    if (!user) return

    try {
        isLoading.value = true
        await axios.delete(`https://c1a9f09250b13f61.mokky.dev/users/${user.id}`)
        await fetchUsers()
    } catch (error) {
        console.error('Error deleting user:', error)
    } finally {
        isLoading.value = false
        closeModal()
    }
}

const disapproveUser = async (user) => {
    if (!user) return

    try {
        isLoading.value = true
        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/users/${user.id}`, {
            status: 'Доступ не одобрен'
        })
        await fetchUsers()
    } catch (error) {
        console.error('Error disapproving user:', error)
    } finally {
        isLoading.value = false
        closeModal()
    }
}

const openApproveModal = (user) => {
    selectedUser.value = user; // Сохраняем выбранного пользователя
    showSelectModal.value = true;
};

const approveUser = async (role) => {
    console.log(selectedUser, role)
    if (!selectedUser.value || !role) return;

    try {
        isLoading.value = true;
        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/users/${selectedUser.value.id}`, {
            role: role,
            status: 'Доступ одобрен'
        });
        await fetchUsers();
    } catch (error) {
        console.error('Error approving user:', error);
    } finally {
        isLoading.value = false;
        closeModal();
        selectedUser.value = null; // Сбрасываем выбранного пользователя
    }
};

onMounted(async () => {
    await fetchUsers()
})
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}
</style>