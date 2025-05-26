<template>
    <Layout>
        <h1>Курсы</h1>
        <button class="blue" @click="openCreateCourseModal">
            <span>Новый курс</span>
            <img src="/icons/plus.svg" alt="">
        </button>
        <div class="courses">
            <Card v-for="course in courses" :key="course.id">
                <div class="top">
                    <img width="36px" height="auto" :src="course.imageUrl" alt="avatar">
                    <span class="name-of-course">{{ course.name }}</span>

                    <div class="action-buttons">
                        <button class="icon edit" @click="openEditCourseModal(course)">
                            <img src="/icons/pen.svg" alt="">
                        </button>
                        <button class="icon delete" @click="openDeleteModal(course)">
                            <img src="/icons/delete.svg" alt="">
                        </button>
                    </div>
                </div>
            </Card>
        </div>
        <CreateCourse v-if="showCreateCourseModal" @cancel="closeModal" @create="createCourse" />

        <EditCourse v-if="showEditCourseModal" @cancel="closeModal" @edit="editCourse" :course="selectedCourse" />

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" />

        <Loading v-if="isLoading" />

        <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить курс?"
            text="Студенты, записанные на этот курс, потеряют доступ к материалам, а куратор утратит все данные об их успеваемости"
            right-button-text="Удалить" @confirm="deleteCourse" @cancel="closeModal" />
    </Layout>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, provide, ref } from "vue";

import Layout from '@/layouts/Layout.vue'
import Card from '@/components/Card.vue'
import Loading from "@/components/Loading.vue";

import CreateCourse from "./modals/CreateCourse.vue";
import Popup from "@/components/Popup.vue";
import ConfirmDelete from "@/components/modals/ConfirmDelete.vue";
import EditCourse from "./modals/EditCourse.vue";

const courses = ref([])

const showCreateCourseModal = ref(false)
const showConfirmDeleteModal = ref(false)
const showEditCourseModal = ref(false)

const router = useRouter()

const showPopup = ref(false)
const popupText = ref('')

const selectedCourse = ref(null)

const isLoading = ref(false);

const closeModal = () => {
    if (showCreateCourseModal.value) { showCreateCourseModal.value = false }
    if (showConfirmDeleteModal.value) { showConfirmDeleteModal.value = false }
    if (showEditCourseModal.value) { showEditCourseModal.value = false }
}

const closePopup = () => {
    showPopup.value = false
    popupText.value = ''
}

const openCreateCourseModal = () => {
    showCreateCourseModal.value = true
}

const openEditCourseModal = (course) => {
    selectedCourse.value = course
    showEditCourseModal.value = true
}

const openDeleteModal = (course) => {
    selectedCourse.value = course
    showConfirmDeleteModal.value = true
}

const fetchCourses = async () => {
    try {
        isLoading.value = true
        const params = {
            sortBy: '-id'
        }
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses`, { params })
        courses.value = data.map(obj => ({
            ...obj
        }))

    } catch (err) {
        console.log(err)
    } finally {
        isLoading.value = false
    }
}

const deleteCourse = async () => {
    if (!selectedCourse.value) return
    try {
        await axios.delete(`https://c1a9f09250b13f61.mokky.dev/courses/${selectedCourse.value.id}`)
        await fetchCourses()
        showConfirmDeleteModal.value = false
        popupText.value = 'Курс удален'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    } catch (error) {
        console.error('Error deleting course:', error)
        closeModal()
        popupText.value = 'Ошибка при удалении курса'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000)
    }
}

const createCourse = async (course) => {
    if (!course) return
    try {
        closeModal()
        const { data } = await axios.post(`https://c1a9f09250b13f61.mokky.dev/courses`, {
            name: course.name,
            imageUrl: course.imageUrl
        })
        popupText.value = 'Курс создан'
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
        }, 5000);
        // await fetchCourses()
        router.push(`/course-fill-content/${data.id}`)
    }
    catch (err) {
        console.log(err)
    }
}

const editCourse = async (updatedCourse) => {
    if (!updatedCourse) return;
    try {
        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${updatedCourse.id}`, {
            name: updatedCourse.name,
            imageUrl: updatedCourse.imageUrl
        });

        closeModal();
        popupText.value = 'Изменения сохранены';
        showPopup.value = true;
        setTimeout(() => {
            showPopup.value = false;
        }, 5000);

        await fetchCourses();
    } catch (err) {
        console.error('Error updating course:', err);
    }
};

onMounted(async () => {
    await fetchCourses()
})

provide('courses', courses)
</script>

<style scoped lang="scss">
button.blue {
    margin: 10px 0;
}

.courses {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 15px 0;

    .card {
        width: 32%;
        cursor: pointer;

        .top {
            width: 100%;
            display: flex;
            gap: 10px;
            // justify-content: space-between;
            align-items: center;


            .name-of-course {
                flex: 1;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: 1px;
            }
        }
    }
}

@media (max-width:1280px) {
    .card {
        width: 49% !important;
    }
}

@media (max-width:768px) {
    .card {
        width: 100% !important;
    }
}

@media (max-width:360px) {
    button.blue {
        width: 100% !important;
    }
}
</style>