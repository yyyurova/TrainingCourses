<template>
    <FillCourseContentLayout>
        <h1>Содержание курса</h1>

        <div v-if="content.chapters.length === 0" class="no-lessons">
            <h2>В курсе пока нет ни одного модуля.</h2>
            <h2>Создайте первый модуль, чтобы добавить страницы</h2>
            <button class="blue" @click="newModule">
                Создать модуль
                <img src="/icons/plus.svg" alt="">
            </button>
        </div>
        <div v-if="content.chapters.length > 0" class="content-of-course">
            <Module v-for="(chapter, index) in content.chapters" :key="index" :num="index + 1" :mod="chapter"
                :module-index="index" @update:name="updateModuleName(index, $event)"
                @delete-module="deleteChapter(index)" @add-page="addPage(index)" @update-page-name="updatePageName" />
        </div>
        <div v-if="content.chapters.length > 0" class="save-block">
            <button @click="saveCourse" class="blue">Сохранить изменения</button>
        </div>
    </FillCourseContentLayout>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse, updateCourseContent } from '@/api/modules/adminCourses.api';
import FillCourseContentLayout from '@/layouts/FillCourseContentLayout.vue';
import Module from './components/Module.vue';

const course = ref(null);
const content = ref({ chapters: [] });

const route = useRoute();
const router = useRouter();

const fetchCourse = async () => {
    try {
        course.value = await getCourse(route.params.courseId);
        // Инициализируем content данными из курса, если они есть
        if (course.value.content) {
            content.value = JSON.parse(JSON.stringify(course.value.content));
        }
    } catch (err) {
        console.error('Ошибка загрузки курса:', err);
    }
};

const newModule = () => {
    content.value.chapters.push({
        name: 'Новый модуль',
        pages: [] // Теперь вместо lessons используем pages
    });
};

const updateModuleName = (index, newName) => {
    content.value.chapters[index].name = newName;
};

const updatePageName = (chapterIndex, pageIndex, newName) => {
    content.value.chapters[chapterIndex].pages[pageIndex].name = newName;
};

const addPage = (chapterIndex) => {
    const newPage = {
        name: 'Новая страница',
        id: Date.now().toString(), // Генерируем уникальный ID для страницы
        content: '' // Добавляем поле для контента страницы
    };
    content.value.chapters[chapterIndex].pages.push(newPage);
};

const deleteChapter = (index) => {
    content.value.chapters.splice(index, 1);
};

const deletePage = (chapterIndex, pageIndex) => {
    content.value.chapters[chapterIndex].pages.splice(pageIndex, 1);
};

const saveCourse = async () => {
    try {
        const hasEmptyFields = Array.from(document.querySelectorAll('input[type="text"]'))
            .some(i => i.value.trim() === '');

        if (hasEmptyFields) {
            alert('Пожалуйста, заполните все названия модулей и страниц');
            return;
        }

        // Подготовка данных для отправки
        const contentData = {
            chapters: content.value.chapters.map(chapter => ({
                title: chapter.title,
                pages: chapter.pages.map(page => ({
                    title: page.title,
                    // id: page.id || Date.now().toString(),
                    content: page.content || ''
                }))
            }))
        };

        // Отправляем обновленное содержание курса
        await updateCourseContent(route.params.courseId, contentData);

        // Перенаправляем на страницу заполнения материалов первого модуля и первой страницы
        if (content.value.chapters.length > 0 && content.value.chapters[0].pages.length > 0) {
            router.push({
                name: 'CourseStep',
                params: {
                    courseId: course.value.id,
                    chapterId: 0,
                    stepId: 0
                }
            });
        } else {
            // Если нет страниц, перенаправляем просто на материалы курса
            router.push({
                name: 'FillMaterials',
                params: { courseId: course.value.id }
            });
        }
    } catch (err) {
        console.error('Ошибка сохранения:', err);
        alert('Не удалось сохранить изменения');
    }
};

provide('course', course);
provide('deletePage', deletePage);

onMounted(fetchCourse);
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