<template>
    <FillCourseMaterialsLayout>
        <Card class="no-hover fill-material" v-if="material">
            <h1>Заполнение учебных материалов для курса</h1>
            <Card v-if="openStep" class="no-hover name">
                <p>{{ openStep.name }}</p>
            </Card>
            <h4>
                Шаг {{ subStep.number + ': ' + translateType(subStep.type) }}
                <button class="icon"><img src="/icons/x.svg" alt=""></button>
            </h4>
            <div v-if="openStep && openStep.subSteps" class="squares-score">
                <span class="square" :class="{ 'filled': (index + 1) === subStep.number }"
                    v-for="(substep, index) in openStep.subSteps" :key="index"></span>
                <span class="square new" @click="openCreateStepModal">
                    <img src="/icons/plus-black.svg" alt="">
                </span>
            </div>

            <TextEditorCard class="text" v-if="subStep.type === 'text'" v-model="content" />
            <div class="video" v-if="subStep.type === 'video'">
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
                    <input type="url" placeholder="Введите ссылку">
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

            <div class="quiz" v-if="subStep.type === 'quiz'">
                <button class="blue" @click="addAnswer">
                    Добавить вопрос
                    <img src="/icons/plus.svg" alt="">
                </button>

                <div class="fill-question">
                    <p>Условие<span class="required">*</span></p>
                    <TextEditorCard v-model="subStep.content.question" />

                    <h4>Настройка</h4>
                    <p>Количество правильных ответов:</p>
                    <div class="radio-inputs">
                        <label class="radio">
                            <input type="radio" name="radio" v-model="selectedQuantity" value="several">
                            <span class="name">
                                Несколько
                                <img src="/icons/checkbox.svg" alt="">
                            </span>
                        </label>
                        <label class="radio">
                            <input type="radio" name="radio" v-model="selectedQuantity" value="one">
                            <span class="name">
                                Один
                                <img src="/icons/radio.svg" alt="">
                            </span>
                        </label>
                    </div>

                    <div class="answers">
                        <Answer v-for="(option, index) in subStep.content.options" :key="index"
                            :input-type="selectedQuantity" :option="option" :index="index" @remove="removeAnswer"
                            @update:option="updateOption(index, $event)" @update:correct="updateCorrectAnswers" />
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
            <button class="transparent">Вернуться к просмотру</button>
        </div>
        <CreateStep v-if="showCreateStepModal" @cancel="closeModal" @create="createNewStep" />
        <SaveChanges v-if="showSaveChangesModal" @cancel="closeModal" @confirm="saveCourse" />
        <Popup v-if="showPopup" :text="popupText" @close="closePopup" />
    </FillCourseMaterialsLayout>
</template>

<script setup>
import { ref, provide, onMounted, watchEffect, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getCourse } from '@/api/modules/courses.api';
import { getModules } from '@/api/modules/materials.api';

import TextEditorCard from '@/components/TextEditorCard.vue';
import FillCourseMaterialsLayout from '@/layouts/FillCourseMaterialsLayout.vue';
import Card from '@/components/Card.vue';
import CreateStep from './components/modals/CreateStep.vue';
import Answer from './components/Answer.vue';
import SaveChanges from './components/modals/SaveChanges.vue';
import Popup from '@/components/Popup.vue';

const course = ref(null);
const material = ref(null);
const openStep = ref(null);
const subStep = ref({ number: 1, type: 'text' });
const content = ref('')

const uploadedFiles = ref([]);
const fileInput = ref(null);

const selectedWay = ref('upload')
const selectedQuantity = ref('several')

const isSaved = ref(false)
const showSaveChangesModal = ref(false)

// const answers = ref([])

const route = useRoute();

const showCreateStepModal = ref(false)

const openSaveChangesModal = () => {
    showSaveChangesModal.value = true
}

const closeModal = () => {
    if (showCreateStepModal.value) { showCreateStepModal.value = false }
    if (showSaveChangesModal.value) { showSaveChangesModal.value = false }
}

const openCreateStepModal = () => {
    showCreateStepModal.value = true
}

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

const saveCourse = async () => {
    try {

        isSaved.value = true;
        closeModal();
    } catch (err) {
        console.error('Ошибка сохранения:', err);
    }
};

const createNewStep = (type) => {
    const newSubStep = {
        number: openStep.value.subSteps.length + 1,
        type: type,
        content: type === 'quiz' ? {
            question: '',
            options: [],
            correct: []
        } : ''
    };

    openStep.value.subSteps.push(newSubStep);
    subStep.value = newSubStep;
    closeModal()
    popupText.value = 'Шаг создан'
    showPopup.value = true
    setTimeout(() => {
        showPopup.value = false
    }, 3000);
};

const addAnswer = () => {
    subStep.value.content.options.push('');
};

const updateOption = (index, value) => {
    subStep.value.content.options[index] = value;
};

const removeAnswer = (index) => {
    subStep.value.content.options.splice(index, 1);

    subStep.value.content.correct = subStep.value.content.correct
        .filter(correctIndex => correctIndex !== index)
        .map(correctIndex => correctIndex > index ? correctIndex - 1 : correctIndex);
};

const updateCorrectAnswers = ({ index, isChecked }) => {
    if (selectedQuantity.value === 'several') {
        const pos = subStep.value.content.correct.indexOf(index);
        if (isChecked && pos === -1) {
            subStep.value.content.correct.push(index);
        } else if (!isChecked && pos !== -1) {
            subStep.value.content.correct.splice(pos, 1);
        }
    } else {
        subStep.value.content.correct = isChecked ? [index] : [];
    }
};

const translateType = (type) => {
    switch (type) {
        case 'text': return 'Текст';
        case 'quiz': return 'Тест';
        case 'code': return 'Код';
        case 'video': return 'Видео';
        default: return 'Неизвестный тип';
    }
}

const showPopup = ref(false)
const popupText = ref('')

const closePopup = () => {
    showPopup.value = false
}
const findMaterialByCourseId = (materials, targetCourseId) => {
    return materials.find(materialObj => {
        return Object.values(materialObj).some(content =>
            content.courseId === targetCourseId
        );
    });
};

const fetchCourse = async () => {
    try {
        course.value = await getCourse(route.params.courseId);
    } catch (err) {
        console.error("Ошибка загрузки курса:", err);
    }
};

const fetchMaterial = async () => {
    try {
        const materials = await getModules()
        const foundMaterial = findMaterialByCourseId(materials, course.value.id);
        if (foundMaterial) {
            const contentKey = Object.keys(foundMaterial)[0];
            material.value = foundMaterial[contentKey];
        }
    } catch (err) {
        console.error("Ошибка загрузки материалов:", err);
    }
};

watch(route, newPath => {
    if (isSaved.value === false) {
        openSaveChangesModal()
    }
})

watchEffect(() => {
    if (material.value?.chapters && route.params.chapterId && route.params.stepId) {
        const chapterIndex = parseInt(route.params.chapterId, 10);
        const stepIndex = parseInt(route.params.stepId, 10);

        if (
            !isNaN(chapterIndex) &&
            !isNaN(stepIndex) &&
            material.value.chapters[chapterIndex]?.steps?.[stepIndex]
        ) {
            openStep.value = {
                ...material.value.chapters[chapterIndex].steps[stepIndex],
                subSteps: material.value.chapters[chapterIndex].steps[stepIndex].subSteps || [{ number: 1, type: 'text  ' }]
            };
        }
    }
});

onMounted(async () => {
    await fetchCourse();
    if (course.value) await fetchMaterial();
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

            &.new {
                // background-color: transparent;
                // border: 1px solid #513DEB;
                display: flex;
                justify-content: center;
                align-items: center;
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