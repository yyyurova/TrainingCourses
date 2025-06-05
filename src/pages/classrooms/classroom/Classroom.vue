<template>
    <Layout>
        <!-- <div v-if="classroom">
            <h1>{{ classroom.name }}</h1>
            <p>{{ classroom.course }}</p>

            <h2>Практиканты</h2>
        </div> -->

        <!-- <ConfirmDelete v-if="showConfirmDeleteModal" :question="`Удалить ${studentRoutes.name}?`"
            text="Студенты и куратор потеряют доступ к курсу" right-button-text="Удалить" @confirm="deleteClassroom"
            @cancel="closeModal" />

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" /> -->
    </Layout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getClassroom } from '@/api/modules/classrooms.api';

import Layout from '@/layouts/Layout.vue';
import Popup from '@/components/Popup.vue';
import ConfirmDelete from '@/components/modals/ConfirmDelete.vue';

const route = useRoute()

const classroom = ref(null)
const isLoading = ref(false)

const fetchClassroom = async () => {
    try {
        isLoading.value = true
        // classroom.value = await getClassroom(route.params.classId)
        classroom.value = { name: 'eijikef', course: 'dbhjwbfwe' }
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchClassroom)
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}

div.classrooms {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 15px 0;

    .card {
        cursor: pointer;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        .left {
            display: flex;
            flex-direction: column;
            gap: 7px;
        }

        .right {
            display: flex;
            gap: 8px;
        }

        p.name {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            letter-spacing: 1px;
        }

        p.course {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
            color: #787878;
        }

        p.members {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
        }
    }
}
</style>