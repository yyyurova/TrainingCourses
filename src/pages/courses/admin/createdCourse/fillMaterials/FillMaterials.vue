<template>
    <Loading v-if="isLoading || !course" />
    <FillCourseMaterialsLayout v-else>
        <Card class="no-hover fill-material" v-if="material && currentModule">
            <h1>Заполнение учебных материалов для курса</h1>
            <Card class="no-hover name">
                <p>{{ currentPage.title }}</p>
            </Card>

            <h4>
                Шаг {{ currentPageIndex + 1 }} : {{ translateType(currentPage.type) }}
                <button class="icon"><img src="/icons/x.svg" alt=""></button>
            </h4>

            <div class="squares-score">
                <span class="square" :class="{ 'filled': index === currentPageIndex }" @click="goToPage(index)"
                    v-for="(page, index) in currentModule.pages" :key="index">
                </span>
            </div>

            <TextEditorCard v-if="currentPage.type === 1" :content="currentPageContent" v-model="currentPageContent" />
            <div class="video" v-else-if="currentPage.type === 2">
                <div class="radio-inputs">
                    <label class="radio">
                        <input type="radio" name="radio" v-model="selectedWay" value="upload">
                        <span class="name">
                            Загрузить файл
                        </span>
                    </label>
                    <label class="radio">
                        <input type="radio" name="radio" v-model="selectedWay" value="other">
                        <span class="name">
                            С другого сайта
                        </span>
                    </label>
                </div>
                <div v-if="selectedWay === 'other'" class="link">
                    <p>Ссылка <span class="required">*</span></p>
                    <input type="url" placeholder="Введите ссылку" v-model="videoLink">
                </div>
                <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" accept="video/*">

                <div v-if="uploadedFiles.length" class="uploaded-files">
                    <Card class="no-hover" v-for="(file, index) in uploadedFiles" :key="index">
                        <img src="/icons/video.svg" alt="">
                        <div class="text">
                            <p> {{ file.name }}</p>
                            <p> {{ formatFileSize(file.size) }}</p>
                        </div>
                        <button class="icon" @click="removeFile(index)"><img src="/icons/x.svg" alt=""></button>
                    </Card>
                </div>
                <button class="blue" @click="fileInput.click()" :disabled="selectedWay === 'other'">Загрузить</button>
            </div>

            <div class="quiz" v-if="currentPage.type === 3">
                <button class="blue" @click="addAnswer">
                    Добавить вопрос
                    <img src="/icons/plus.svg" alt="">
                </button>

                <div class="fill-question">
                    <p>Условие<span class="required">*</span></p>
                    <TextEditorCard v-model="quizData.question" />

                    <h4>Настройка</h4>
                    <p>Количество правильных ответов:</p>
                    <div class="radio-inputs">
                        <label class="radio">
                            <input type="radio" name="radio" v-model="quizData.quantity" value="several">
                            <span class="name">
                                Несколько
                                <img src="/icons/checkbox.svg" alt="">
                            </span>
                        </label>
                        <label class="radio">
                            <input type="radio" name="radio" v-model="quizData.quantity" value="one">
                            <span class="name">
                                Один
                                <img src="/icons/radio.svg" alt="">
                            </span>
                        </label>
                    </div>

                    <div class="answers">
                        <Answer v-for="(option, index) in quizData.options" :key="index" :input-type="quizData.quantity"
                            :option="option.text" :index="index" :is-correct="quizData.correct.includes(index)"
                            @remove="removeAnswer" @update:option="updateOption(index, $event)"
                            @update:correct="updateCorrectAnswers" />
                    </div>

                    <button class="transparent" @click="addAnswer">
                        Добавить вариант ответа
                        <img src="/icons/plus-black.svg" alt="">
                    </button>
                </div>
            </div>
        </Card>
        <div class="save-block">
            <button class="blue" @click="saveCourse">Сохранить изменения</button>
        </div>
        <SaveChanges v-if="showSaveChangesModal" @cancel="closeModal" @confirm="saveCourse" />
        <Popup v-if="showPopup" :text="popupText" @close="closePopup" />
    </FillCourseMaterialsLayout>
</template>

<script setup>
import { ref, provide, onMounted, watchEffect, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse } from '@/api/modules/adminCourses.api';
import {
    getModules,
    getPagesForModule,
    updatePage,
    updateQuestion,
    createQuestion,
    getQuestionsForPage
} from '@/api/modules/adminMaterials.api';

import TextEditorCard from '@/components/TextEditorCard.vue';
import FillCourseMaterialsLayout from '@/layouts/FillCourseMaterialsLayout.vue';
import Card from '@/components/Card.vue';
import Answer from './components/Answer.vue';
import SaveChanges from './components/modals/SaveChanges.vue';
import Popup from '@/components/Popup.vue';
import Loading from '@/components/Loading.vue';

const course = ref(null);
const material = ref(null);
const isLoading = ref(false);

const currentModule = ref(null);
const currentPage = ref(null);
const currentPageIndex = ref(0);
const currentQuestion = ref(null);

const currentPageContent = ref('');
const videoLink = ref('');
const uploadedFiles = ref([]);
const fileInput = ref(null);
const selectedWay = ref('upload');

const quizData = ref({
    question: '',
    options: [],
    correct: [],
    quantity: 'several'
});

const isSaved = ref(false);
const showSaveChangesModal = ref(false);
const showPopup = ref(false);
const popupText = ref('');

const route = useRoute();
const router = useRouter();

const openSaveChangesModal = () => {
    showSaveChangesModal.value = true
}

const translateType = (type) => {
    switch (type) {
        case 1: return 'Текст';
        case 2: return 'Видео';
        case 3: return 'Тест';
        default: return '';
    }
};

const goToPage = async (index) => {
    if (!currentModule.value) return;

    const page = currentModule.value.pages[index];
    if (page) {
        router.push(`/course-fill-materials/${course.value.id}/module/${currentModule.value.id}/page/${page.id}`);
    }
};

const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const newFiles = Array.from(files).map(file => ({
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
    }));

    uploadedFiles.value = [...uploadedFiles.value, ...newFiles];
};

const removeFile = (index) => {
    uploadedFiles.value.splice(index, 1);
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const fetchMaterial = async () => {
    try {
        isLoading.value = true;
        if (!course.value?.id) return;

        const modules = await getModules(course.value.id);

        for (const module of modules) {
            module.pages = await getPagesForModule(module.id);
        }

        material.value = {
            id: course.value.id,
            modules: modules
        };
    } catch (err) {
        console.error("Ошибка загрузки материалов:", err);
    } finally {
        isLoading.value = false;
    }
};

const loadPageQuestion = async (pageId) => {
    try {
        const questions = await getQuestionsForPage(pageId);
        currentQuestion.value = questions[0] || null;
        return currentQuestion.value;
    } catch (err) {
        console.error("Ошибка загрузки вопроса:", err);
        return null;
    }
};

const loadPageContent = async () => {
    if (!currentPage.value) return;

    // Загружаем вопрос для текущей страницы
    await loadPageQuestion(currentPage.value.id);

    if (currentPage.value.type === 1) {
        // Текстовая страница
        console.log(currentQuestion.value?.description)

        currentPageContent.value = currentQuestion.value?.description || '';
    }
    else if (currentPage.value.type === 2) {
        // Видео страница
        try {
            const videoData = currentQuestion.value?.description ? JSON.parse(currentQuestion.value.description) : {};
            selectedWay.value = videoData.selectedWay || 'upload';
            videoLink.value = videoData.link || '';
            uploadedFiles.value = videoData.files || [];
        } catch {
            selectedWay.value = 'upload';
            videoLink.value = '';
            uploadedFiles.value = [];
        }
    }
    else if (currentPage.value.type === 3) {
        // Тест
        try {
            const quizContent = currentQuestion.value?.description ? JSON.parse(currentQuestion.value.description) : {};
            quizData.value = {
                question: quizContent.question || '',
                options: quizContent.options?.map(text => ({ text })) || [],
                correct: quizContent.correct || [],
                quantity: quizContent.quantity || 'several'
            };
        } catch {
            quizData.value = {
                question: '',
                options: [],
                correct: [],
                quantity: 'several'
            };
        }
    }
};

const saveCourse = async () => {
    try {
        closeModal();
        if (!currentPage.value) return;
        console.log(currentPageContent.value)

        let description = '';
        const title = currentPage.value.title;

        switch (currentPage.value.type) {
            case 1:
                description = currentPageContent.value;
                break;
            case 2:
                description = JSON.stringify({
                    selectedWay: selectedWay.value,
                    link: selectedWay.value === 'other' ? videoLink.value : '',
                    files: uploadedFiles.value
                });
                break;
            case 3:
                description = JSON.stringify({
                    question: quizData.value.question,
                    options: quizData.value.options.map(opt => opt.text),
                    correct: quizData.value.correct,
                    quantity: quizData.value.quantity
                });
                break;
        }

        if (currentQuestion.value) {
            await updateQuestion(
                currentPage.value.id,
                currentQuestion.value.id,
                title,
                description
            );
        } else {
            const newQuestion = await createQuestion(
                currentPage.value.id,
                title,
                description
            );
            currentQuestion.value = newQuestion;
        }

        popupText.value = 'Изменения успешно сохранены';
        showPopup.value = true;
        isSaved.value = true;

        setTimeout(() => {
            showPopup.value = false;
        }, 5000);

    } catch (err) {
        console.error('Ошибка сохранения:', err);
        popupText.value = 'Ошибка при сохранении: ' + (err.message || err);
        showPopup.value = true;
    }
}

const addAnswer = () => {
    quizData.value.options.push({ text: '' });
};

const updateOption = (index, value) => {
    quizData.value.options[index].text = value;
};

const removeAnswer = (index) => {
    quizData.value.options.splice(index, 1);
    quizData.value.correct = quizData.value.correct
        .filter(correctIndex => correctIndex !== index)
        .map(correctIndex => correctIndex > index ? correctIndex - 1 : correctIndex);
};

const updateCorrectAnswers = ({ index, isChecked }) => {
    if (quizData.value.quantity === 'several') {
        const pos = quizData.value.correct.indexOf(index);
        if (isChecked && pos === -1) {
            quizData.value.correct.push(index);
        } else if (!isChecked && pos !== -1) {
            quizData.value.correct.splice(pos, 1);
        }
    } else {
        quizData.value.correct = isChecked ? [index] : [];
    }
};

const closeModal = () => {
    showSaveChangesModal.value = false;
};

const closePopup = () => {
    showPopup.value = false;
};

const fetchCourse = async () => {
    try {
        course.value = await getCourse(route.params.courseId);
    } catch (err) {
        console.error("Ошибка загрузки курса:", err);
    }
};

watch(route, async (newRoute) => {
    if (!isSaved.value && currentPage.value) {
        openSaveChangesModal();
    } else {
        await loadCurrentPage();
    }
});

const loadCurrentPage = async () => {
    if (material.value?.modules) {
        const moduleId = parseInt(route.params.moduleId, 10);
        const pageId = parseInt(route.params.pageId, 10);

        const module = material.value.modules.find(m => m.id === moduleId);
        if (module) {
            currentModule.value = module;

            const page = module.pages.find(p => p.id === pageId);
            if (page) {
                currentPage.value = page;
                console.log(currentPage.value)
                currentPageIndex.value = module.pages.indexOf(page);
                await loadPageContent();
            }
        }
    }
};

onMounted(async () => {
    await fetchCourse();
    if (course.value) {
        await fetchMaterial();
        await loadCurrentPage();
    }
});

provide('course', course);
provide('material', material);
</script>

<style scoped lang="scss">
.fill-material {
    width: 100%;
    gap: 15px;
    margin-bottom: 10px;

    .radio-inputs {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        border-radius: 8px;
        background-color: #fff;
        box-sizing: border-box;
        border: 1px solid #D9D9D9;
        width: 40%;
        font-size: 14px;

        .radio {
            flex: 1 1 auto;
            text-align: center;

            input {
                display: none;

                &:checked+.name {
                    background-color: #E9F2FF;
                }
            }
        }

        .name {
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            gap: 7px;
            border-radius: 8px;
            border: none;
            padding: 10px 0;
            color: #292929;
            transition: all .15s ease-in-out;
        }
    }

    .card.name {
        // margin: 20px 0;
        width: 100%;
        padding: 12px 20px;

        p {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0px;
        }
    }

    h4 {
        display: flex;
        align-items: center;
        margin: 0;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1px;
    }

    .squares-score {
        // margin: 10px 0;
        display: flex;
        gap: 8px;

        .square {
            border-radius: 5px;
            width: 40px;
            height: 40px;
            background-color: transparent;
            border: 1px solid #513DEB;
            display: inline-block;
            cursor: pointer;

            &.filled {
                background-color: #513DEB;
            }
        }
    }

    .video {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;

        .link {
            width: 100%;

            p {
                margin-bottom: 5px;
            }

            input {
                width: 40%;
            }
        }

        button.blue {
            width: 20%;

            &:disabled {
                background-color: #D9D9D9;
                color: #6f6d6d;
            }
        }

        .uploaded-files {
            display: flex;
            // flex-direction: column;
            flex-wrap: wrap;
            gap: 10px;

            .card {
                width: 40%;
                flex-direction: row;
                align-items: center;
                gap: 10px;

                .text {
                    flex: 1;

                    p:nth-child(2) {
                        color: #787878;
                    }
                }
            }
        }
    }

    .quiz {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;


        .fill-question {
            display: flex;
            flex-direction: column;
            gap: 10px;

            :deep(.editor-content) {
                min-height: 70px;
            }

            button.transparent {
                border: 1px solid #513DEB;
            }
        }

        .answers {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
}

.save-block {
    display: flex;
    padding: 12px;
    background-color: #F8F8F8;
    justify-content: center;
    gap: 10px;
    width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;

    button.transparent {
        border: 1px solid #513DEB;
    }
}

@media (max-width: 480px) {
    .save-block {
        flex-direction: column;
        align-items: center;
    }
}
</style>