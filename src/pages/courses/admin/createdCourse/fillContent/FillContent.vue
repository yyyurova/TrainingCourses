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
                    name: page.title,
                    content: page.content
                }))
            }))
        };
    } catch (err) {
        console.error('Ошибка загрузки курса:', err);
    }
};
let tempId = -1;

const newModule = () => {
    const newId = tempId--;
    content.value.modules.push({
        id: newId,
        name: 'Новый модуль',
        pages: []
    });
    changes.modules.added.push({
        id: newId,
        title: 'Новый модуль'
    });
};

const updateModuleName = (index, newName) => {
    const module = content.value.modules[index];
    const oldName = module.name;
    module.name = newName;

    if (module.id < 0) {
        const addedModule = changes.modules.added.find(m => m.id === module.id);
        if (addedModule) addedModule.title = newName;
    } else {
        const existingUpdate = changes.modules.updated.find(m => m.id === module.id);
        if (existingUpdate) {
            existingUpdate.title = newName;
        } else {
            changes.modules.updated.push({
                id: module.id,
                title: newName
            });
        }
    }
};

const addPage = (chapterIndex) => {
    const chapter = content.value.modules[chapterIndex];
    const newId = tempId--;

    const newPage = {
        id: newId,
        name: 'Новая страница',
        content: ''
    };

    chapter.pages.push(newPage);

    changes.pages.added.push({
        id: newId,
        module_id: chapter.id,
        title: 'Новая страница'
    });
};

const updatePageName = (chapterIndex, pageIndex, newName) => {
    const page = content.value.modules[chapterIndex].pages[pageIndex];
    const oldName = page.name;
    page.name = newName;

    if (page.id < 0) {
        const addedPage = changes.pages.added.find(p => p.id === page.id);
        if (addedPage) addedPage.title = newName;
    } else {
        const existingUpdate = changes.pages.updated.find(p => p.id === page.id);
        if (existingUpdate) {
            existingUpdate.title = newName;
        } else {
            changes.pages.updated.push({
                id: page.id,
                title: newName
            });
        }
    }
};

const deleteChapter = (index) => {
    const deletedModule = content.value.modules.splice(index, 1)[0];

    if (deletedModule.id < 0) {
        changes.modules.added = changes.modules.added.filter(m => m.id !== deletedModule.id);
    } else {
        changes.modules.deleted.push(deletedModule.id);

        deletedModule.pages.forEach(page => {
            if (page.id < 0) {
                changes.pages.added = changes.pages.added.filter(p => p.id !== page.id);
            } else {
                changes.pages.deleted.push(page.id);
            }
        });
    }
};

provide('deletePage', (chapterIndex, pageIndex) => {
    const chapter = content.value.modules[chapterIndex];
    const deletedPage = chapter.pages.splice(pageIndex, 1)[0];

    if (deletedPage.id < 0) {
        changes.pages.added = changes.pages.added.filter(p => p.id !== deletedPage.id);
    } else {
        changes.pages.deleted.push(deletedPage.id);
    }
});

const saveCourse = async () => {
    try {
        for (const pageId of changes.pages.deleted) {
            await deletePage(module.id, pageId);
        }

        for (const moduleId of changes.modules.deleted) {
            await deleteModule(course.value.id, moduleId);
        }

        const tempIdMap = new Map();
        for (const module of changes.modules.added) {
            const response = await createModule(course.value.id, module.title);
            tempIdMap.set(module.id, response.id);

            const localModule = content.value.modules.find(m => m.id === module.id);
            if (localModule) localModule.id = response.id;
        }

        for (const module of changes.modules.updated) {
            await updateModule(course.value.id, module.id, module.title);
        }

        for (const page of changes.pages.added) {
            const realModuleId = page.module_id < 0
                ? tempIdMap.get(page.module_id)
                : page.module_id;

            if (!realModuleId) continue;

            const response = await createPage(realModuleId, page.title);

            for (const chapter of content.value.modules) {
                const localPage = chapter.pages.find(p => p.id === page.id);
                if (localPage) localPage.id = response.id;
            }
        }

        for (const page of changes.pages.updated) {
            const chapter = content.value.modules.find(ch =>
                ch.pages.some(p => p.id === page.id)
            );
            if (chapter) {
                await updatePage(chapter.id, page.id, page.title);
            }
        }

        Object.keys(changes).forEach(key => {
            changes[key].added = [];
            changes[key].updated = [];
            changes[key].deleted = [];
        });

        router.push({
            name: 'CoursePage',
            params: {
                courseId: course.value.id,
                moduleId: content.value.modules[0].id,
                pageId: content.value.modules[0].pages[0].id
            }
        });
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