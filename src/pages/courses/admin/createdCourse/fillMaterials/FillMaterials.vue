<template>
    <FillCourseMaterialsLayout>
        <Loading v-if="isLoading || !course" />

        <div class="" v-if="!isLoading && course">
            <Card class="no-hover fill-material" v-if="material && currentModule">
                <h1>Заполнение учебных материалов для курса</h1>

                <Card class="no-hover page-name">
                    <input type="text" v-model="pageName">
                </Card>

                <h4>
                    Шаг {{ currentPageIndex + 1 }} : {{ translateType(currentPage?.type) }}
                    <button class="icon"><img src="/icons/x.svg" alt=""></button>
                </h4>

                <div class="squares-score">
                    <span class="square" :class="{ 'filled': index === currentPageIndex }" @click="goToPage(index)"
                        v-for="(page, index) in currentModule.pages" :key="index">
                    </span>
                </div>

                <TextEditorCard v-if="currentPage.type === 1" v-model="currentPageContent" />

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

                    <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload"
                        accept="video/*">

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
                    <button class="blue" @click="fileInput.click()"
                        :disabled="selectedWay === 'other'">Загрузить</button>
                </div>

                <div class="quiz" v-if="currentPage.type === 3">
                    <div class="question-list" v-if="quizData.questions?.length">
                        <div class="question-item" v-for="(question, qIndex) in quizData.questions" :key="qIndex">
                            <div class="question-header">
                                <h4>Вопрос {{ qIndex + 1 }}</h4>
                                <button class="icon" @click="removeQuestion(qIndex)">
                                    <img src="/icons/x.svg" alt="">
                                </button>
                            </div>

                            <div class="fill-question">
                                <p>Заголовок<span class="required">*</span></p>
                                <input type="text" v-model="question.title">
                                <p>Описание</p>
                                <TextEditorCard v-model="question.description" />

                                <h4>Настройка</h4>
                                <p>Количество правильных ответов:</p>
                                <div class="radio-inputs">
                                    <label class="radio">
                                        <input type="radio" :name="'radio-' + qIndex" :value="true"
                                            v-model="question.is_group">
                                        <span class="name">
                                            Несколько
                                            <img src="/icons/checkbox.svg" alt="">
                                        </span>
                                    </label>
                                    <label class="radio">
                                        <input type="radio" :name="'radio-' + qIndex" :value="false"
                                            v-model="question.is_group">
                                        <span class="name">
                                            Один
                                            <img src="/icons/radio.svg" alt="">
                                        </span>
                                    </label>
                                </div>

                                <div class="answers">
                                    <Answer v-for="(option, index) in question.options" :key="index"
                                        :input-type="question.is_group ? 'several' : 'one'" :option="option.title"
                                        :index="index" :is-correct="option.is_right === 1"
                                        @remove="() => removeAnswer(qIndex, index)"
                                        @update:option="(val) => updateOption(qIndex, index, val)"
                                        @update:correct="(data) => updateCorrectAnswers(qIndex, data)" />
                                </div>

                                <button class="transparent border" @click="() => addAnswer(qIndex)">
                                    Добавить вариант ответа
                                    <img src="/icons/plus-black.svg" alt="">
                                </button>
                            </div>
                        </div>
                    </div>

                    <button class="blue" @click="addNewQuestion">
                        Добавить вопрос
                        <img src="/icons/plus.svg" alt="">
                    </button>
                </div>
            </Card>
            <div class="save-block">
                <button class="blue" @click="saveCourse">Сохранить изменения</button>
                <button class="transparent border" @click="goToCourses">Вернуться к списку курсов</button>
            </div>
        </div>
        <SaveChanges v-if="showSaveChangesModal" @cancel="closeModal" @confirm="saveCourse" @discard="discardChanges" />
        <Popup v-if="showPopup" :text="popupText" @close="closePopup" :is-success="isSuccess" />
    </FillCourseMaterialsLayout>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { getCourse } from '@/api/modules/adminCourses';
import {
    getModules,
    getPagesForModule,
    updatePage,
    updateQuestion,
    createQuestion,
    deleteQuestion,
    getQuestionsForPage,
    getVariants,
    createVariant,
    updateVariant,
    deleteVariant
} from '@/api/modules/adminMaterials';

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

const isInitializing = ref(true);

const hasChanges = ref(false);

const nextRoute = ref(null);

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
    questions: []
});

const pageName = ref('')
const showSaveChangesModal = ref(false);

const isSuccess = ref(true)
const showPopup = ref(false);
const popupText = ref('');

const route = useRoute();
const router = useRouter();

const openSaveChangesModal = () => {
    showSaveChangesModal.value = true
}

const discardChanges = () => {
    hasChanges.value = false;
    if (nextRoute.value !== null) {
        const index = nextRoute.value;
        nextRoute.value = null;
        goToPage(index);
    }
    closeModal();
};

const translateType = (type) => {
    switch (type) {
        case 1: return 'Текст';
        case 2: return 'Видео';
        case 3: return 'Тест';
        default: return '';
    }
};

const goToCourses = () => {
    router.push('/courses')
}

const goToPage = async (index) => {
    if (!currentModule.value) return;

    const page = currentModule.value.pages[index];
    if (page && !hasChanges.value) {
        router.push(`/course-fill-materials/${course.value.id}/module/${currentModule.value.id}/page/${page.id}`);
    }

    nextRoute.value = index;
    openSaveChangesModal()
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
        modules.sort((a, b) => a.id - b.id);

        for (const module of modules) {
            const pages = await getPagesForModule(module.id);
            pages.sort((a, b) => a.id - b.id);
            module.pages = pages;
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
    isInitializing.value = true;

    await loadPageQuestion(currentPage.value.id);

    if (currentPage.value.type === 1) {
        currentPageContent.value = currentQuestion.value?.description || '';
    }
    else if (currentPage.value.type === 2) {
        selectedWay.value = 'other';
        videoLink.value = '';
        uploadedFiles.value = [];

        if (currentQuestion.value?.description) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentQuestion.value.description, 'text/html');
            const iframe = doc.querySelector('iframe');

            if (iframe && iframe.src.includes('youtube.com')) {
                videoLink.value = iframe.src.replace('embed/', 'watch?v=');
            } else if (currentQuestion.value.description.startsWith('http')) {
                videoLink.value = currentQuestion.value.description;
            }
        }

        if (currentQuestion.value?.attachments?.length) {
            selectedWay.value = 'upload';
            uploadedFiles.value = currentQuestion.value.attachments.map(att => ({
                name: att.filename || 'Видеофайл',
                size: att.size || 0,
                type: att.mimetype || 'video/*'
            }));
        }
    }
    else if (currentPage.value.type === 3) {
        try {
            const questions = await getQuestionsForPage(currentPage.value.id);
            quizData.value.questions = await Promise.all(questions.map(async (q) => {
                const variants = await getVariants(q.id);
                return {
                    id: q.id,
                    title: q.title,
                    description: q.description || '',
                    is_group: q.is_group || false,
                    options: variants.map(v => ({
                        id: v.id,
                        title: v.title,
                        is_right: v.is_right
                    }))
                };
            }));
            if (quizData.value.questions.length === 0) {
                addNewQuestion();
            }
        } catch (err) {
            console.error("Ошибка загрузки теста:", err);
            quizData.value.questions = [];
            addNewQuestion();
        }
    }
    isInitializing.value = false;
};

const saveCourse = async () => {
    try {
        closeModal();
        if (!currentPage.value) return;

        if (currentPage.value.title !== pageName.value) {
            await updatePage(currentModule.value.id, currentPage.value.id, pageName.value, currentPage.value.type);
        }

        if (currentPage.value.type === 1) {
            const description = currentPageContent.value;
            if (currentQuestion.value?.id) {
                isLoading.value = true
                await updateQuestion(
                    currentPage.value.id,
                    currentQuestion.value.id,
                    pageName.value,
                    description
                );
                isLoading.value = false
            } else {
                isLoading.value = true
                await createQuestion(
                    currentPage.value.id,
                    pageName.value,
                    description
                );
                isLoading.value = false
            }
        }
        else if (currentPage.value.type === 2) {
            let description = '';
            let attachments = [];

            if (selectedWay.value === 'other' && videoLink.value) {
                description = generateVideoIframe(videoLink.value);
            } else if (selectedWay.value === 'upload') {
                attachments = [...uploadedFiles.value];
            }

            if (currentQuestion.value?.id) {
                isLoading.value = true
                await updateQuestion(
                    currentPage.value.id,
                    currentQuestion.value.id,
                    pageName.value,
                    description,
                    false,
                    attachments
                );
                isLoading.value = false
            } else {
                isLoading.value = true
                await createQuestion(
                    currentPage.value.id,
                    pageName.value,
                    description,
                    false,
                    attachments
                );
                isLoading.value = false
            }
        }
        else if (currentPage.value.type === 3) {
            for (const question of quizData.value.questions) {

                let questionId;
                try {
                    if (question.id) {
                        isLoading.value = true
                        const response = await updateQuestion(
                            currentPage.value.id,
                            question.id,
                            question.title,
                            question.description,
                            question.is_group
                        );
                        isLoading.value = false
                        questionId = question.id;
                    } else {
                        isLoading.value = true
                        const response = await createQuestion(
                            currentPage.value.id,
                            question.title,
                            question.description,
                            question.is_group
                        );
                        isLoading.value = false

                        if (response && response.data && response.data.id) {
                            questionId = response.data.id;
                            question.id = questionId;
                        } else {
                            throw new Error('Не удалось создать вопрос: некорректный ответ от сервера');
                        }
                    }
                } catch (err) {
                    console.error("Ошибка при сохранении вопроса:", err);
                    continue;
                }

                let currentVariants = [];
                try {
                    currentVariants = await getVariants(questionId);
                } catch (err) {
                    console.error("Ошибка при получении вариантов:", err);
                }

                const currentVariantIds = currentVariants.map(v => v.id);

                for (const option of question.options) {
                    try {
                        if (option.id && currentVariantIds.includes(option.id)) {
                            isLoading.value = true
                            await updateVariant(
                                questionId,
                                option.id,
                                option.title,
                                option.is_right ? 1 : 0
                            );
                            isLoading.value = false
                            const index = currentVariantIds.indexOf(option.id);
                            if (index !== -1) {
                                currentVariantIds.splice(index, 1);
                            }
                        } else {
                            isLoading.value = true
                            const response = await createVariant(
                                questionId,
                                option.title,
                                option.is_right ? 1 : 0
                            );
                            isLoading.value = false
                            if (response && response.data && response.data.id) {
                                option.id = response.data.id;
                            }
                        }
                    } catch (err) {
                        console.error("Ошибка при сохранении варианта:", err);
                    }
                }

                for (const variantId of currentVariantIds) {
                    try {
                        await deleteVariant(questionId, variantId);
                    } catch (err) {
                        console.error("Ошибка при удалении варианта:", err);
                    }
                }
            }
        }

        hasChanges.value = false;
        await fetchMaterial();
        if (route.params.pageId !== currentPage.value.id) {
            await loadCurrentPage()
        }

        showMessage('Изменения успешно сохранены', true)

        if (nextRoute.value !== null) {
            const index = nextRoute.value;
            nextRoute.value = null;
            const page = currentModule.value.pages[index];
            router.push(`/course-fill-materials/${course.value.id}/module/${currentModule.value.id}/page/${page.id}`);
        }
    } catch (err) {
        if (err.status === 413) {
            showMessage('Слишком большой размер прикрепленного файла', false)
        }
        else {
            console.error('Ошибка сохранения:', err);
            showMessage('Ошибка при сохранении: ' + (err.message || err), false)
        }
    }
};

const generateVideoIframe = (url) => {
    const videoId = extractVideoId(url);
    if (videoId) {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
    return url;
};

const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    uploadedFiles.value = files.map(file => file);
    e.target.value = '';
};

const addNewQuestion = () => {
    quizData.value.questions.push({
        id: null,
        title: '',
        description: '',
        options: [],
    });
};

const removeQuestion = async (index) => {
    const question = quizData.value.questions[index];
    if (question.id) {
        await deleteQuestion(currentPage.value.id, question.id);
    }
    quizData.value.questions.splice(index, 1);
};

const addAnswer = (qIndex) => {
    quizData.value.questions[qIndex].options.push({
        id: null,
        title: '',
        is_right: 0
    });
};

const updateOption = (qIndex, aIndex, value) => {
    quizData.value.questions[qIndex].options[aIndex].title = value;
};

const removeAnswer = async (qIndex, aIndex) => {
    const option = quizData.value.questions[qIndex].options[aIndex];
    if (option.id) {
        await deleteVariant(quizData.value.questions[qIndex].id, option.id);
    }
    quizData.value.questions[qIndex].options.splice(aIndex, 1);
    quizData.value.questions[qIndex].correctAnswers =
        quizData.value.questions[qIndex].correctAnswers
            .filter(i => i !== aIndex)
            .map(i => i > aIndex ? i - 1 : i);
};

const updateCorrectAnswers = (qIndex, { index, isChecked }) => {
    const question = quizData.value.questions[qIndex];
    const isSingle = question.answerType === 'one';

    if (isSingle && isChecked) {
        question.options.forEach((opt, i) => {
            opt.is_right = i === index ? 1 : 0;
        });
    } else {
        question.options[index].is_right = isChecked ? 1 : 0;
    }
};

const closeModal = () => {
    showSaveChangesModal.value = false;
};

const closePopup = () => {
    showPopup.value = false;
};

const showMessage = (text, success) => {
    popupText.value = text;
    isSuccess.value = success;
    showPopup.value = true;
    setTimeout(() => showPopup.value = false, 5000);
};

const fetchCourse = async () => {
    try {
        course.value = await getCourse(route.params.courseId);
    } catch (err) {
        console.error("Ошибка загрузки курса:", err);
    }
};

watch(route, async (newRoute, oldRoute) => {
    if (hasChanges.value) {
        openSaveChangesModal();
    } else {
        await loadCurrentPage();
    }
});

const loadCurrentPage = async () => {
    hasChanges.value = false;

    if (material.value?.modules) {
        const moduleId = parseInt(route.params.moduleId, 10);
        const pageId = parseInt(route.params.pageId, 10);

        const module = material.value.modules.find(m => m.id === moduleId);
        if (module) {
            currentModule.value = module;

            const page = module.pages.find(p => p.id === pageId);
            if (page) {
                currentPage.value = page;
                pageName.value = page.title;
                currentPageIndex.value = module.pages.indexOf(page);
                await loadPageContent();
            }
        }
    }
};

onBeforeRouteLeave((to, from, next) => {
    if (hasChanges.value) {
        openSaveChangesModal();
        next(false);
    } else {
        next();
    }
});

onMounted(async () => {
    await fetchCourse();
    if (course.value) {
        await fetchMaterial();
        await loadCurrentPage();
    }
});

watch([() => currentPageContent.value, () => videoLink.value, () => uploadedFiles.value, () => quizData.value], () => {
    if (isInitializing.value || !currentPage.value) return;
    hasChanges.value = true;
}, { deep: true });

provide('course', course);
provide('material', material);
</script>

<style scoped lang="scss">
.fill-material {
    width: 100%;
    gap: 15px;
    margin-bottom: 10px;

    .page-name {
        padding: 5px;

        input {
            width: 100%;
            padding: 10px;
            border: none;
            outline: none;
        }
    }

    .radio-inputs {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        border-radius: 8px;
        background-color: #fff;
        box-sizing: border-box;
        border: 1px solid #D9D9D9;
        width: 40%;
        min-width: 300px;
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

        .question-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 20px;
        }

        .question-item {
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
            background: #f9f9f9;
        }

        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .fill-question {
            display: flex;
            flex-direction: column;
            gap: 10px;

            :deep(.editor-content) {
                min-height: 70px;
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

}

@media (max-width: 480px) {
    .save-block {
        flex-direction: column;
        align-items: center;
    }
}
</style>