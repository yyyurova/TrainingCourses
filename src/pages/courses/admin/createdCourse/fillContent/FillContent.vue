<template>
    <FillCourseContentLayout>
        <h1>Содержание курса</h1>

        <div v-if="content.chapters.length === 0" class="no-lessons">
            <h2>В курсе пока нет ни одного урока.</h2>
            <h2> Создайте первый модуль, чтобы добавить уроки</h2>
            <button class="blue" @click="newModule">
                Создать модуль
                <img src="/icons/plus.svg" alt="">
            </button>
        </div>
        <div v-if="content.chapters.length > 0" class="content-of-course">
            <Module v-for="(m, index) in content.chapters" :key="index" :num="index + 1" :mod="m" :module-index="index"
                @update:name="updateModuleName(index, $event)" @delete-module="deleteChapter(index)"
                @add-lesson="addLesson(index)" @update-lesson-name="updateLessonName" />
        </div>
        <div v-if="content.chapters.length > 0" class="save-block">
            <button @click="saveCourse" class="blue">Сохранить изменения</button>
        </div>
    </FillCourseContentLayout>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getCourse } from '@/api/modules/courses.api';

import FillCourseContentLayout from '@/layouts/FillCourseContentLayout.vue';
import Module from './components/Module.vue';

const course = ref(null)
const content = ref({ chapters: [] })

const route = useRoute()
const router = useRouter()

const fetchCourse = async () => {
    try {
        course.value = await getCourse(route.params.courseId)
    } catch (err) { console.log(err) }
}

const newModule = () => {
    content.value.chapters.push({
        name: 'Новый модуль',
        lessons: []
    });
}

const updateModuleName = (index, newName) => {
    content.value.chapters[index].name = newName;
}

const updateLessonName = (chapterIndex, lessonIndex, newName) => {
    content.value.chapters[chapterIndex].lessons[lessonIndex].name = newName;
};

const addLesson = (chapterIndex) => {
    const newLesson = {
        name: 'Новый урок',
        id: Date.now()
    };
    content.value.chapters[chapterIndex].lessons.push(newLesson);
};

const deleteChapter = (index) => {
    content.value.chapters.splice(index, 1);
}

const deleteLesson = (chapterIndex, lessonIndex) => {
    content.value.chapters[chapterIndex].lessons.splice(lessonIndex, 1);
}

const saveCourse = async () => {
    try {
        const hasEmptyFields = Array.from(document.querySelectorAll('input[type="text"]'))
            .some(i => i.value.trim() === '')

        if (hasEmptyFields) {
            return
        }
        const courseData = {
            ...course.value,
            contentId: course.value.contentId || generateContentId()
        };

        await axios.patch(`https://c1a9f09250b13f61.mokky.dev/courses/${route.params.courseId}`, courseData);

        const contentData = {
            [courseData.contentId]: {
                courseId: course.value.id,
                chapters: content.value.chapters.map(module => ({
                    name: module.name,
                    steps: module.lessons.map(lesson => ({
                        name: lesson.name,
                        substeps: []
                    }))
                }))
            }
        };

        await axios.post('https://c1a9f09250b13f61.mokky.dev/materials', contentData);

        router.push(`/course-fill-materials/${course.value.id}/0/0`)
    } catch (err) {
        console.error('Ошибка сохранения:', err);
    }
};

const generateContentId = () => {
    return `${course.value.name.toLowerCase().replace(/ /g, '-')}-content`;
};

provide('course', course)
provide('deleteLesson', deleteLesson)

onMounted(fetchCourse)
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