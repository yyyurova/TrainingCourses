<template>
    <FillCourseContentLayout>
        <div class="" v-if="!isLoading">
            <div class="top">
                <h1>Содержание курса</h1>
                <button class="blue new-page" @click="newModule" v-if="content.modules.length > 0">
                    Новый модуль
                    <img src="/icons/actions/plus.svg" alt="">
                </button>
            </div>

            <div v-if="content.modules.length === 0" class="no-lessons">
                <h2>В курсе пока нет ни одного модуля.</h2>
                <h2>Создайте первый модуль, чтобы добавить страницы</h2>
                <button class="blue" @click="newModule">
                    Создать модуль
                    <img src="/icons/actions/plus.svg" alt="">
                </button>
            </div>

            <div v-if="content.modules.length > 0" class="content-of-course">
                <Module v-for="(chapter, index) in content.modules" :key="index" :num="index + 1" :mod="chapter"
                    :module-index="index" @update:name="updateModuleName(index, $event)"
                    @delete-module="deleteChapter(index)" @add-page="addPage(index)"
                    @update-page-name="updatePageName" />
            </div>

            <div v-if="content.modules.length > 0" class="save-block">
                <button @click="saveCourse" class="blue">Сохранить изменения</button>
            </div>
        </div>

        <Popup :text="popupText" v-if="showPopup" @closePopup="closePopup" :isSuccess="isSuccess" />

        <Loading v-if="isLoading" />

        <CreateLesson v-if="showCreateLessonModal" @cancel="closeModal" @create="createPageWithType" />
    </FillCourseContentLayout>
</template>

<script setup>
import { onMounted, provide, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse } from '@/api/modules/adminCourses';
import {
    createModule,
    updateModule,
    createPage,
    updatePage,
    getModules,
    getPagesForModule,
    deleteModule,
    deletePage
} from '@/api/modules/adminMaterials';

import CreateLesson from '../fillMaterials/components/modals/CreateLesson.vue';
import FillCourseContentLayout from '@/layouts/FillCourseContentLayout.vue';
import Module from './components/Module.vue';
import Loading from '@/components/Loading.vue';
import Popup from '@/components/Popup.vue';

const course = ref(null);
const content = ref({ modules: [] });
const changes = reactive({
    modules: {
        added: [],
        updated: [],
        deleted: []
    },
    pages: {
        added: [],
        updated: [],
        deleted: []
    }
});

const route = useRoute();
const router = useRouter()

const isLoading = ref(false)

const showPopup = ref(false);
const popupText = ref('');
const isSuccess = ref(true);

const showCreateLessonModal = ref(false)
const currentModuleIndex = ref(null);

const closeModal = () => {
    if (showCreateLessonModal.value) { showCreateLessonModal.value = false }
}

const closePopup = () => { showPopup.value = false }

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const fetchCourse = async () => {
    try {
        isLoading.value = true
        course.value = await getCourse(route.params.courseId);

        const modules = await getModules(route.params.courseId);
        modules.sort((a, b) => a.id - b.id);

        for (const module of modules) {
            const pages = await getPagesForModule(module.id);
            pages.sort((a, b) => a.id - b.id);
            module.pages = pages;
        }

        content.value = {
            modules: modules.map(module => ({
                id: module.id,
                name: module.title,
                noPages: false,
                pages: module.pages.map(page => ({
                    id: page.id,
                    title: page.title,
                    type: page.type,
                    content: page.content
                }))
            }))
        };
    } catch (err) {
        console.error('Ошибка загрузки курса:', err);
    }
    finally {
        isLoading.value = false
    }
};

const newModule = async () => {
    try {
        if (content.value?.modules?.length > 0 && changes.modules.updated.length > 0) {
            for (const module of changes.modules.updated) {
                await updateModule(course.value.id, module.id, module.title);
            }
            changes.modules.updated = [];
        }

        if (changes.pages.updated.length > 0) {
            for (const page of changes.pages.updated) {
                await updatePage(page.moduleId, page.id, page.title, page.type);
            }
            changes.pages.updated = [];
        }

        await createModule(course.value.id, 'Новый модуль');

        await fetchCourse();
    } catch (error) {
        showMessage('Ошибка создания модуля', false)
    }
};

const updateModuleName = (index, newName) => {
    const module = content.value.modules[index];
    module.name = newName;

    const existingUpdate = changes.modules.updated.find(m => m.id === module.id);
    if (!existingUpdate) {
        changes.modules.updated.push({
            id: module.id,
            title: newName
        });
    } else {
        existingUpdate.title = newName;
    }
};

const updatePageName = (chapterIndex, pageIndex, newName) => {
    const page = content.value.modules[chapterIndex].pages[pageIndex];
    const module = content.value.modules[chapterIndex];
    page.title = newName;

    const existingUpdate = changes.pages.updated.find(p => p.id === page.id);
    if (!existingUpdate) {
        changes.pages.updated.push({
            moduleId: module.id,
            id: page.id,
            title: newName,
            type: page.type
        });
    } else {
        existingUpdate.title = newName;
    }
};

const addPage = (chapterIndex) => {
    currentModuleIndex.value = chapterIndex;
    showCreateLessonModal.value = true;
};

const createPageWithType = async (type) => {
    if (currentModuleIndex.value === null) return;

    const module = content.value.modules[currentModuleIndex.value];
    const typeNames = { 1: 'Текст', 2: 'Видео', 3: 'Тест' };
    const pageTitle = `Новая страница (${typeNames[type]})`;

    try {
        closeModal();

        const response = await createPage(
            module.id,
            pageTitle,
            type,
        );

        module.pages.push({
            id: response.data.id,
            title: response.data.title || `Новая страница (${typeNames[type]})`,
            type: type,
            content: ''
        });

        content.value.modules[currentModuleIndex.value].noPages = false
    } catch (error) {
        console.error('Ошибка создания страницы:', error);
    }
};

const deleteChapter = async (index) => {
    const deletedModule = content.value.modules[index];

    try {
        await deleteModule(course.value.id, deletedModule.id);
        content.value.modules.splice(index, 1);
    } catch (error) {
        console.error('Ошибка удаления модуля:', error);
    }
};

provide('deletePage', async (chapterIndex, pageIndex) => {
    const chapter = content.value.modules[chapterIndex];
    const deletedPage = chapter.pages[pageIndex];

    try {
        await deletePage(chapter.id, deletedPage.id);
        chapter.pages.splice(pageIndex, 1);
    } catch (error) {
        console.error('Ошибка удаления страницы:', error);
    }
});

const saveCourse = async () => {
    try {
        for (const module of changes.modules.updated) {
            await updateModule(course.value.id, module.id, module.title);
        }

        for (const page of changes.pages.updated) {
            await updatePage(page.moduleId, page.id, page.title, page.type);
        }

        changes.modules.updated = [];
        changes.pages.updated = [];

        if (content.value.modules.length > 0 && content.value.modules[0].pages.length > 0) {
            router.push(`/course-fill-materials/${course.value.id}/module/${content.value.modules[0].id}/page/${content.value.modules[0].pages[0].id}`);
        } else {
            showMessage('Изменения сохранены', true)
        }
    } catch (error) {
        showMessage('Не удалось сохранить изменения', false)
        console.error('Ошибка сохранения:', error);
    }
};

onMounted(fetchCourse);

provide('course', course);
provide('content', content)
</script>

<style scoped lang="scss">
.no-lessons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-top: 70px;

    h2 {
        font-weight: 600;
        font-size: 36px;
        line-height: 42px;
        letter-spacing: 1px;
        text-align: center;
    }
}

.top {
    display: flex;
    justify-content: space-between;
}

.content-of-course {
    margin: 10px 0;
    display: flex;
    gap: 10px;
    flex-direction: column;
}

.save-block {
    display: flex;
    padding: 12px;
    background-color: #F8F8F8;
    justify-content: center;
    width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;
}

@media (max-width: 1280px) {
    .no-lessons {
        h2:nth-child(2) {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0px;
            text-align: center;
        }
    }
}

@media (max-width: 960px) {
    .top {
        flex-direction: column;
    }
}
</style>