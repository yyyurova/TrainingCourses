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
                    <img class="avatar" width :src="course.photo || '/image.png'" alt="avatar">
                    <span class="name-of-course">{{ course.title }}</span>

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

        <!-- <Loading v-if="isLoading || !courses" /> -->

        <ConfirmDelete v-if="showConfirmDeleteModal" question="Удалить курс?"
            text="Студенты, записанные на этот курс, потеряют доступ к материалам, а куратор утратит все данные об их успеваемости"
            right-button-text="Удалить" @confirm="deleteCourse" @cancel="closeModal" />
    </Layout>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { inject, onMounted, provide, ref } from "vue";
import { getCourses, deleteCourse as apiDeleteCourse, editCourse as apiEditCourse, createCourse as apiCreateCourse } from "@/api/modules/adminCourses.api";

import Layout from '@/layouts/Layout.vue'
import Card from '@/components/Card.vue'
import Loading from "@/components/Loading.vue";

import CreateCourse from "./modals/CreateCourse.vue";
import Popup from "@/components/Popup.vue";
import ConfirmDelete from "@/components/modals/ConfirmDelete.vue";
import EditCourse from "./modals/EditCourse.vue";

const courses = inject('courses')

const showCreateCourseModal = ref(false)
const showConfirmDeleteModal = ref(false)
const showEditCourseModal = ref(false)

const router = useRouter()

const showPopup = ref(false)
const popupText = ref('')

const selectedCourse = ref(null)

// const isLoading = ref(false);

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

// const fetchCourses = async () => {
//     try {
//         isLoading.value = true
//         courses.value = await getCourses()
//     } finally {
//         isLoading.value = false
//     }
// }

const deleteCourse = async () => {
    if (!selectedCourse.value) return
    try {
        await apiDeleteCourse(selectedCourse.value.id)
        courses.value = courses.value.filter(c => c.id !== selectedCourse.value.id)
        // await fetchCourses()
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
        const data = await apiCreateCourse({
            title: course.title,
            // photo: course.photo || null
        })
        router.push(`/course-fill-content/${data.data.data.id}`)
    }
    catch (err) {
        console.log(err)
    }
}

const editCourse = async (updatedCourse) => {
    if (!updatedCourse || !selectedCourse.value) return;
    try {
        courses.value = courses.value.filter(c => c.id !== selectedCourse.value.id)
        await apiEditCourse(selectedCourse.value.id, {
            title: updatedCourse.title,
            photo: updatedCourse.imageUrl
        })
        courses.value.push({
            ...selectedCourse.value, title: updatedCourse.title,
            photo: updatedCourse.imageUrl
        })
        courses.value.sort(c => -c.id)
        closeModal();
        popupText.value = 'Изменения сохранены';
        showPopup.value = true;
        setTimeout(() => {
            showPopup.value = false;
        }, 5000);

        // await fetchCourses();
    } catch (err) {
        console.error('Error updating course:', err);
    }
};

// onMounted(async () => {
//     await fetchCourses()
// })

// provide('courses', courses)
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
        width: calc(50% - 5px) !important;

        cursor: pointer;

        .top {
            width: 100%;
            display: flex;
            gap: 10px;
            // justify-content: space-between;
            align-items: flex-start;

            .name-of-course {
                flex: 1;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
                letter-spacing: 1px;
            }

            .avatar {
                width: 36px;
                height: auto;
                border-radius: 4px;
            }
        }
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