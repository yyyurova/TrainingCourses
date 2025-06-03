<template>
    <FillCourseContentLayout>
        <h1>Содержание курса</h1>

        <div v-if="content.modules.length === 0" class="no-lessons">
            <h2>В курсе пока нет ни одного модуля.</h2>
            <h2>Создайте первый модуль, чтобы добавить страницы</h2>
            <button class="blue" @click="newModule">
                Создать модуль
                <img src="/icons/plus.svg" alt="">
            </button>
        </div>
        <div v-if="content.modules.length > 0" class="content-of-course">
            <Module v-for="(chapter, index) in content.modules" :key="index" :num="index + 1" :mod="chapter"
                :module-index="index" @update:name="updateModuleName(index, $event)"
                @delete-module="deleteChapter(index)" @add-page="addPage(index)" @update-page-name="updatePageName" />
        </div>
        <div v-if="content.modules.length > 0" class="save-block">
            <button @click="saveCourse" class="blue">Сохранить изменения</button>
        </div>
        <CreateLesson v-if="showCreateLessonModal" @cancel="closeModal" @create="createPageWithType" />
    </FillCourseContentLayout>
</template>

<script setup>
import { onMounted, provide, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse } from '@/api/modules/adminCourses.api';
import {
    createModule,
    updateModule,
    createPage,
    updatePage,
    getModules,
    getPagesForModule,
    deleteModule,
    deletePage
} from '@/api/modules/adminMaterials.api';

import CreateLesson from '../fillMaterials/components/modals/CreateLesson.vue';
import FillCourseContentLayout from '@/layouts/FillCourseContentLayout.vue';
import Module from './components/Module.vue';

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

const showCreateLessonModal = ref(false)
const currentModuleIndex = ref(null);

const closeModal = () => {
    if (showCreateLessonModal.value) { showCreateLessonModal.value = false }
}

const fetchCourse = async () => {
    try {
        course.value = await getCourse(route.params.courseId);

        const modules = await getModules(route.params.courseId);

        for (const module of modules) {
            const pages = await getPagesForModule(module.id);
            module.pages = pages;
        }

        content.value = {
            modules: modules.map(module => ({
                id: module.id,
                name: module.title,
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
};

const newModule = async () => {
    try {
        const response = await createModule(course.value.id, 'Новый модуль');
        await fetchCourse()
        // content.value.modules.push({
        //     id: response.id,
        //     name: response.title || 'Новый модуль',
        //     pages: []
        // });
    } catch (error) {
        console.error('Ошибка создания модуля:', error);
    }
};

const updateModuleName = (index, newName) => {
    const module = content.value.modules[index];
    module.name = newName;

    // Добавляем в изменения для сохранения (если еще нет)
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
    page.name = newName;

    // Добавляем в изменения для сохранения
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
        const response = await createPage(
            module.id,
            pageTitle,
            type,
        );

        module.pages.push({
            id: response.id,
            title: response.title || `Новая страница (${typeNames[type]})`,
            type: type,
            content: ''
        });

        closeModal();

        // if (content.value.modules[0].id === module.id &&
        //     content.value.modules[0].pages.length === 1) {
        //     router.push({
        //         name: 'FillContent',
        //         params: {
        //             courseId: course.value.id,
        //         }
        //     });
        // }
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
            console.log(page.moduleId, page.id, page.title, page.type, page)
            await updatePage(page.moduleId, page.id, page.title, page.type);
        }

        changes.modules.updated = [];
        changes.pages.updated = [];

        console.log('Изменения успешно сохранены');
        if (content.value.modules.length > 0 && content.value.modules[0].pages.length > 0) {
            router.push(`/course-fill-materials/${course.value.id}/module/${content.value.modules[0].id}/page/${content.value.modules[0].pages[0].id}`);
        } else {
            console.log('Переход невозможен: модуль еще не сохранён или нет страниц');
        }
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
};

onMounted(fetchCourse);

provide('course', course);
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
</style>