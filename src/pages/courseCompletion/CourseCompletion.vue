<template>
    <CourseCompletionLayout>
        <Card v-if="end" class="no-hover end">
            <h1>Ты завершил модуль!!!</h1>
            <img src="/nice.jfif" alt="">
        </Card>
        <Card v-if="module && !end" class="no-hover" :style="!material ? 'height:100vh' : ''">
            <h1 class="chapterName">
                {{ module.title }}
                <span class="score">{{ completedPages + " из " + module.pages.length + " шагов пройдено" }}</span>
            </h1>
            <div class="squares-score">
                <span class="square" :class="page.completed ? 'filled' : ''" v-for="(page, index) in module.pages"
                    :key="index" @click="goToPage(index)"></span>
            </div>

            <div v-if="currentPageData && !loading" class="content">
                <div v-if="currentPageData.questions && currentPageData.questions.length">
                    <div v-for="(question, qIndex) in currentPageData.questions" :key="qIndex">
                        <div v-if="question.description" v-html="formatTextContent(question.description)"></div>

                        <div v-if="question.variants && question.variants.length" class="quiz-section">
                            <h2>{{ question.title || 'Тест' }}</h2>
                            <div class="options">
                                <div v-for="(variant, vIndex) in question.variants" :key="vIndex">
                                    <input type="checkbox" v-model="selectedAnswers[qIndex]" :value="variant.id"
                                        :disabled="quizChecked[qIndex]">
                                    {{ (vIndex + 1) + ') ' + variant.title }}
                                </div>
                            </div>

                            <div v-if="quizChecked[qIndex]" class="quiz-result"
                                :class="quizPassed[qIndex] ? 'success' : 'error'">
                                <p v-if="quizPassed[qIndex]">✅ Верно!</p>
                                <p v-else>❌ Неверно. Попробуйте еще раз.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button v-if="hasQuizzes" @click="checkQuiz" :disabled="!hasSelectedAnswers || loading">
                    Проверить тест
                </button>

                <button class="blue" @click="nextPage" :disabled="(hasQuizzes && !allQuizzesPassed) || loading">
                    {{ isLastPage ? 'Завершить модуль' : 'Следующий шаг' }}
                </button>
            </div>
        </Card>
    </CourseCompletionLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch, provide } from 'vue';
import { useRoute } from 'vue-router';
import { getCourse } from '@/api/modules/courses.api';
import { getModules } from '@/api/modules/materials.api';
import { getModulePage } from '@/api/modules/materials.api';

import CourseCompletionLayout from '@/layouts/CourseCompletionLayout.vue';
import Card from '@/components/Card.vue';

const material = ref(null);
const route = useRoute();
const course = ref(null);
const courseId = route.params.courseId;
const end = ref(false);
const loading = ref(false);

// const module = ref(null);
// const currentPageIndex = ref(0);
const currentPageData = ref(null);
const selectedAnswers = ref({});
const quizChecked = ref({});
const quizPassed = ref({});

const moduleIndex = computed(() => parseInt(route.params.moduleIndex) || 0)
const pageIndex = computed(() => parseInt(route.params.pageIndex) || 0)

const module = computed(() => {
    return material.value?.[moduleIndex.value] || null
})

const currentPageIndex = ref(pageIndex.value)

const fetchMaterial = async () => {
    try {
        course.value = await getCourse(courseId);
        material.value = await getModules(courseId);
        if (material.value?.length > 0) {
            module.value = material.value[0];
            await loadPageContent();
        }
    } catch (err) {
        console.error('Ошибка загрузки данных:', err);
    }
};

const loadPageContent = async () => {
    if (!module.value || !module.value.pages[currentPageIndex.value]) return;

    const pageId = module.value.pages[currentPageIndex.value].id;
    loading.value = true;
    resetQuizState();

    try {
        currentPageData.value = await getModulePage(module.value.id, pageId);


        if (currentPageData.value.questions) {
            currentPageData.value.questions.forEach((_, index) => {
                selectedAnswers.value[index] = [];
                quizChecked.value[index] = false;
                quizPassed.value[index] = false;
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
    } finally {
        loading.value = false;
    }
};

const completedPages = computed(() => {
    return module.value?.pages.filter(page => page.completed).length || 0;
});

const isLastPage = computed(() => {
    return currentPageIndex.value === module.value?.pages.length - 1;
});

const hasQuizzes = computed(() => {
    return currentPageData.value?.questions?.some(q => q.variants?.length > 0);
});

const allQuizzesPassed = computed(() => {
    return Object.values(quizPassed.value).every(passed => passed);
});

const hasSelectedAnswers = computed(() => {
    return Object.values(selectedAnswers.value).some(answers => answers.length > 0);
});

const formatTextContent = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
};

const checkQuiz = () => {
    if (!currentPageData.value?.questions) return;

    currentPageData.value.questions.forEach((question, qIndex) => {
        if (question.variants?.length > 0) {
            const correctAnswers = question.variants
                .filter(v => v.is_correct)
                .map(v => v.id);

            const userAnswers = [...selectedAnswers.value[qIndex]].sort();
            const correctAnswersSorted = [...correctAnswers].sort();

            quizPassed.value[qIndex] =
                userAnswers.length === correctAnswers.length &&
                userAnswers.every((val, idx) => val === correctAnswersSorted[idx]);

            quizChecked.value[qIndex] = true;
        }
    });
};

const nextPage = () => {
    if (!module.value.pages[currentPageIndex.value].completed) {
        module.value.pages[currentPageIndex.value].completed = true;
    }

    if (currentPageIndex.value < module.value.pages.length - 1) {
        currentPageIndex.value++;
    } else {
        completeModule();
    }
};

const resetQuizState = () => {
    selectedAnswers.value = {};
    quizChecked.value = {};
    quizPassed.value = {};
};

const goToPage = (index) => {
    currentPageIndex.value = index;
};

const completeModule = () => {
    end.value = true;
};

watch(currentPageIndex, async () => {
    await loadPageContent();
});

watch(() => route.params.pageIndex, (newIndex) => {
    if (newIndex !== undefined) {
        currentPageIndex.value = parseInt(newIndex)
        loadPageContent()
    }
})

onMounted(fetchMaterial);
provide('material', material);
provide('course', course);
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
