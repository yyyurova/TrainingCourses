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
                <button class="blue" :disabled="selectedWay === 'other'">Загрузить</button>
            </div>

            <div class="quiz" v-if="subStep.type === 'quiz'">
                <button class="blue">
                    Добавить вопрос
                    <img src="/icons/plus.svg" alt="">
                </button>

                <div class="fill-question">
                    <p>Условие<span class="required">*</span>
                    </p>
                    <TextEditorCard />
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
                    <div class="answers" v-if="selectedQuantity === 'several'">
                        <Card v-for="(answer, index) in answers" :key="index">
                            <input type="checkbox">
                            <input type="text" :value="answer.text">
                            <button class="icon">
                                <img src="/icons/x.svg" alt="">
                            </button>
                        </Card>
                    </div>
                    <div class="answers" v-if="selectedQuantity === 'one'">
                        <Card v-for="(answer, index) in answers" :key="index">
                            <input type="radio">
                            <input type="text" :value="answer.text">
                            <button class="icon">
                                <img src="/icons/x.svg" alt="">
                            </button>
                        </Card>
                    </div>
                    <button class="transparent">
                        Добавить вариант ответа
                        <img src="/icons/plus-black.svg" alt="">
                    </button>
                </div>
            </div>
        </Card>
        <div class="save-block">
            <button class="blue">Сохранить изменения</button>
            <button class="transparent">Вернуться к просмотру</button>
        </div>
        <CreateStep v-if="showCreateStepModal" @cancel="closeModal" @create="createNewStep" />
    </FillCourseMaterialsLayout>
</template>

<script setup>
import { ref, provide, onMounted, watchEffect, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import TextEditorCard from '@/components/TextEditorCard.vue';
import FillCourseMaterialsLayout from '@/layouts/FillCourseMaterialsLayout.vue';
import Card from '@/components/Card.vue';
import CreateStep from './components/modals/CreateStep.vue';

const course = ref(null);
const material = ref(null);
const openStep = ref(null);
const subStep = ref({ number: 1, type: 'text' });
const content = ref('')

const selectedWay = ref('upload')
const selectedQuantity = ref('several')

const answers = ref([])

const route = useRoute();

const showCreateStepModal = ref(false)

const closeModal = () => {
    if (showCreateStepModal.value) { showCreateStepModal.value = false }
}

const openCreateStepModal = () => {
    showCreateStepModal.value = true
}

const createNewStep = (type) => {
    if (!openStep.value?.subSteps) {
        openStep.value.subSteps = [];
    }

    const newStep = {
        number: openStep.value.subSteps.length + 1,
        type: type,
        content: ''
    };

    openStep.value.subSteps.push(newStep);
    subStep.value = newStep;
    closeModal();
}

const translateType = (type) => {
    switch (type) {
        case 'text': return 'Текст';
        case 'quiz': return 'Тест';
        case 'code': return 'Код';
        case 'video': return 'Видео';
        default: return 'Неизвестный тип';
    }
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
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses/${route.params.courseId}`);
        course.value = data;
    } catch (err) {
        console.error("Ошибка загрузки курса:", err);
    }
};

const fetchMaterial = async () => {
    try {
        const { data: materials } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/materials`);
        const foundMaterial = findMaterialByCourseId(materials, course.value.id);
        if (foundMaterial) {
            const contentKey = Object.keys(foundMaterial)[0];
            material.value = foundMaterial[contentKey];
        }
    } catch (err) {
        console.error("Ошибка загрузки материалов:", err);
    }
};

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
</style>