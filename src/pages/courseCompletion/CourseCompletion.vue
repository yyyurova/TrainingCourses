<template>
    <CourseCompletionLayout>
        <Card v-if="end" class="no-hover end">
            <h1>Ты завершил шаг!!!</h1>
            <img src="/nice.jfif" alt="">
        </Card>
        <Card v-if="section && !end" class="no-hover" :style="!material ? 'height:100vh' : ''">
            <h1 class="chapterName">
                {{ section.name }}
                <span class="score">{{ completedSteps + " из " + section.substeps.length + " шагов пройдено" }}</span>
            </h1>
            <div class="squares-score">
                <span class="square" :class="substep.completed ? 'filled' : ''"
                    v-for="(substep, index) in section.substeps" :key="index" @click="goToStep(index)"></span>
            </div>

            <!-- Текстовый контент -->
            <div v-if="currentStepContent.type === 'text'" class="content"
                v-html="formatTextContent(currentStepContent.content)"></div>

            <!-- Блок с кодом -->
            <div v-if="currentStepContent.type === 'code'" class="content">
                <pre><code>{{ currentStepContent.content }}</code></pre>
                <div v-if="currentStepContent.explanation" class="explanation">
                    {{ currentStepContent.explanation }}
                </div>
            </div>

            <!-- Тест -->
            <div v-if="currentStepContent.type === 'quiz'" class="content">
                <h2>Тест</h2>
                <p>{{ currentStepContent.content.question }}</p>
                <div class="options">
                    <div v-for="(option, index) in currentStepContent.content.options" :key="index">
                        <input type="checkbox" v-model="selectedAnswers" :value="index" :disabled="quizChecked">
                        {{ (index + 1) + ') ' + option }}
                    </div>
                </div>

                <div v-if="quizChecked" class="quiz-result" :class="quizPassed ? 'success' : 'error'">
                    <p v-if="quizPassed">✅ Верно! {{ currentStepContent.content.explanation }}</p>
                    <p v-else>❌ Неверно. Попробуйте еще раз. {{ currentStepContent.content.explanation }}</p>
                </div>
            </div>

            <div class="action-buttons">
                <button v-if="currentStepContent.type === 'quiz'" @click="checkQuiz"
                    :disabled="selectedAnswers.length === 0 || quizChecked">
                    Проверить тест
                </button>

                <button v-if="currentStepContent.type === 'quiz'" class="blue" @click="nextStep">
                    {{ isLastStep ? 'Завершить раздел' : 'Следующий шаг' }}
                </button>

                <button v-if="currentStepContent.type !== 'quiz'" class="blue" @click="nextStep">
                    {{ isLastStep ? 'Завершить раздел' : 'Следующий шаг' }}
                </button>
            </div>
        </Card>
    </CourseCompletionLayout>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';

import CourseCompletionLayout from '@/layouts/CourseCompletionLayout.vue';
import Card from '@/components/Card.vue';

const material = ref(null)
const route = useRoute()
const course = ref(null)
const courseId = route.params.courseId
const end = ref(false)

const section = ref(null)
const currentStepIndex = ref(0)
const selectedAnswers = ref([])
const quizChecked = ref(false)
const quizPassed = ref(false)

const fetchMaterial = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses/${courseId}`)
        course.value = data

        const { data: materials } = await axios.get('https://c1a9f09250b13f61.mokky.dev/materials')
        const materialData = materials.find(m => m[course.value.contentId])
        material.value = materialData[course.value.contentId]

    } catch (err) {
        console.error('Ошибка загрузки данных:', err)
    }
}

const currentStepContent = computed(() => {
    return section.value?.substeps[currentStepIndex.value] || null
})

const completedSteps = computed(() => {
    return section.value?.substeps.filter(step => step.completed).length || 0
})

const isLastStep = computed(() => {
    return currentStepIndex.value === section.value?.substeps.length - 1
})

const formatTextContent = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
}

const checkQuiz = () => {
    if (currentStepContent.value.type !== 'quiz') return

    const correctAnswers = currentStepContent.value.content.correct
    const userAnswers = [...selectedAnswers.value].sort().toString()
    const correctAnswersStr = [...correctAnswers].sort().toString()

    quizPassed.value = userAnswers === correctAnswersStr
    quizChecked.value = true

    if (quizPassed.value) {
        currentStepContent.value.completed = true
    }
}

const nextStep = () => {
    if (!quizChecked.value && currentStepContent.value.type === 'quiz') {
        return
    }

    if (currentStepIndex.value < section.value.substeps.length - 1) {
        section.value.substeps[currentStepIndex.value].completed = true
        currentStepIndex.value++
        resetQuizState()
    } else {
        completeSection()
    }
}

const resetQuizState = () => {
    selectedAnswers.value = []
    quizChecked.value = false
    quizPassed.value = false
}

const goToStep = (index) => {
    currentStepIndex.value = index
    resetQuizState()
}

const completeSection = () => {
    section.value.substeps[currentStepIndex.value].completed = true
    end.value = true
}

onMounted(async () => {
    await fetchMaterial()
    section.value = material.value.chapters[0].steps[0]
})

provide('material', material)
provide('course', course)
</script>

<style scoped lang="scss">
.card {
    width: 100%;
    gap: 15px;

    &.end {
        align-items: center;
    }

    .chapterName {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 10px;

        .score {
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0px;
        }
    }

    .squares-score {
        // margin: 10px 0;
        display: flex;

        .square {
            border-radius: 5px;
            width: 40px;
            height: 40px;
            margin: 2px;
            border: 1px solid #513DEB;
            display: inline-block;
            cursor: pointer;

            &.filled {
                background-color: #513DEB;
            }
        }
    }

    .content {
        width: 100%;

        h2 {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            letter-spacing: 1px;
        }

        code {
            box-sizing: border-box;
            border-radius: 8px;
            padding: 10px 20px;
            display: block;
            width: 100%;
            white-space: break-spaces;
            background-color: #F8F8F8;
        }

        .options {
            margin-top: 10px;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;

            div {
                display: flex;
                align-items: center;
                gap: 8px;
            }
        }

        .quiz-result {
            margin-top: 10px;
        }
    }

    .action-buttons {
        gap: 10px;

        button.transparent {
            border: 1px solid #513DEB;
        }

        button:disabled {
            pointer-events: none;
            background-color: #EBEBEB;
            color: #969696;
        }
    }

    button {
        width: 200px;
        height: 43px;
    }
}
</style>
