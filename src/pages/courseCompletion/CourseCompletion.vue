<template>
    <CourseCompletionLayout>
        <EndOfModule v-if="endOfModule" @next="goToNextModule" />
        <EndOfCourse v-if="endOfCourse" />

        <Card v-if="currentModule && !endOfModule && !endOfCourse" class="no-hover"
            :style="!material ? 'height:100vh' : ''">
            <h1 class="chapterName">
                {{ currentModule.title }}
                <span class="score">{{ completedPages + " из " + currentModule.pages.length + " шагов пройдено"
                }}</span>
            </h1>
            <div class="squares-score">
                <span class="square" :class="page.completed ? 'filled' : ''" v-for="page in currentModule.pages"
                    :key="page.id" @click="goToPage(page.id)">
                </span>
            </div>

            <div v-if="currentPageData && !loading" class="content">
                <div v-if="currentPageData.questions && currentPageData.questions.length" class="qiuz">
                    <div v-for="(question, qIndex) in currentPageData.questions" :key="qIndex">
                        <div v-if="question.variants && question.variants.length" class="quiz-section">
                            <h2>{{ question.title || 'Тест' }}</h2>
                            <div v-if="question.description" v-html="formatTextContent(question.description)"></div>
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
                                <p v-else>❌ Неверно.</p>
                            </div>
                        </div>
                        <div class="" v-else v-html="question.description"></div>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button v-if="hasQuizzes" @click="checkQuiz" :disabled="!hasSelectedAnswers || loading">
                    Проверить тест
                </button>

                <button class="blue" @click="nextPage" :disabled="(hasQuizzes && !quizWasChecked) || loading">
                    {{ isLastPage ? 'Завершить модуль' : 'Следующий шаг' }}
                </button>
            </div>
        </Card>
        <Loading v-if="loading" />
    </CourseCompletionLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourse, getCourseActivity } from '@/api/modules/courses.api';
import { getModules, getModulePage } from '@/api/modules/studentMaterials.api';
import { sendAnswer } from '@/api/modules/studentAnswers.api';

import CourseCompletionLayout from '@/layouts/CourseCompletionLayout.vue';
import Card from '@/components/Card.vue';
import EndOfModule from './components/EndOfModule.vue';
import EndOfCourse from './components/EndOfCourse.vue';
import Loading from '@/components/Loading.vue';

const material = ref(null);
const router = useRouter();
const route = useRoute();
const course = ref(null);
const activity = ref(null);
const courseId = route.params.courseId;

const endOfModule = ref(false);
const endOfCourse = ref(false);
const loading = ref(false);
const currentPageData = ref(null);

const selectedAnswers = ref({});
const quizChecked = ref({});
const quizPassed = ref({});
const quizWasChecked = ref(false);
const quizzesCompleted = ref({});

const currentModuleId = ref(null);
const currentPageId = ref(null);

const currentModule = computed(() => {
    return material.value?.find(m => m.id === currentModuleId.value) || null;
});

const currentPageIndex = computed(() => {
    return currentModule.value?.pages?.findIndex(p => p.id === currentPageId.value) ?? -1;
});

const isLastPage = computed(() => {
    return currentPageIndex.value === currentModule.value?.pages?.length - 1;
});

const isLastModule = computed(() => {
    const index = material.value?.findIndex(m => m.id === currentModuleId.value) ?? -1;
    return index === material.value?.length - 1;
});

const completedPages = computed(() => {
    return currentModule.value?.pages?.filter(page => page.completed).length || 0;
});

const hasQuizzes = computed(() => {
    return currentPageData.value?.questions?.some(q => q.variants?.length > 0);
});

const allQuizzesPassed = computed(() => {
    return currentPageData.value?.questions?.every((question, index) => {
        return !question.variants?.length || quizzesCompleted.value[index] === true;
    }) ?? true;
});

const hasSelectedAnswers = computed(() => {
    return Object.values(selectedAnswers.value).some(answers => answers.length > 0);
});
const resetQuizState = () => {
    selectedAnswers.value = {};
    quizChecked.value = {};
    quizPassed.value = {};
    quizWasChecked.value = false;
};

const formatTextContent = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
};

const fetchMaterial = async () => {
    try {
        loading.value = true;
        [course.value, activity.value, material.value] = await Promise.all([
            getCourse(courseId),
            getCourseActivity(courseId),
            getModules(courseId)
        ]);

        if (!material.value?.length) return;

        currentModuleId.value = route.params.moduleId || activity.value?.course_module_id || material.value[0].id;

        const targetModule = material.value.find(m => m.id === currentModuleId.value);
        if (!targetModule) {
            currentModuleId.value = material.value[0].id;
            currentPageId.value = material.value[0].pages[0]?.id;
            return;
        }

        currentPageId.value = route.params.pageId || activity.value?.course_module_page_id || targetModule.pages[0]?.id;

        if (!currentPageId.value && targetModule.pages?.length) {
            currentPageId.value = targetModule.pages[0].id;
        }

        if (route.params.moduleId !== currentModuleId.value || route.params.pageId !== currentPageId.value) {
            router.push({
                name: 'CourseCompletionPage',
                params: {
                    courseId,
                    moduleId: currentModuleId.value,
                    pageId: currentPageId.value
                }
            });
        } else {
            await loadPageContent();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    } finally {
        loading.value = false;
    }
};

const loadPageContent = async () => {
    if (!currentModuleId.value || !currentPageId.value) return;

    try {
        loading.value = true;
        resetQuizState();
        currentPageData.value = await getModulePage(currentModuleId.value, currentPageId.value);

        if (currentPageData.value?.questions) {
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

const goToPage = (pageId) => {
    if (!currentModuleId.value || !pageId) return;
    router.push({
        name: 'CourseCompletionPage',
        params: {
            courseId,
            moduleId: currentModuleId.value,
            pageId
        }
    });
};

const nextPage = async () => {
    if (!currentModule.value || currentPageIndex.value === -1) return;

    currentModule.value.pages[currentPageIndex.value].completed = true;

    if (isLastPage.value && isLastModule.value) {
        completeCourse();
        return;
    }

    if (isLastPage.value) {
        completeModule();
        return;
    }

    const nextPageId = currentModule.value.pages[currentPageIndex.value + 1].id;
    goToPage(nextPageId);
};

const goToNextModule = () => {
    endOfModule.value = false;
    if (!material.value) return;

    const currentIndex = material.value.findIndex(m => m.id === currentModuleId.value);
    if (currentIndex < material.value.length - 1) {
        const nextModule = material.value[currentIndex + 1];
        const nextPageId = nextModule.pages[0]?.id;

        if (nextPageId) {
            currentModuleId.value = nextModule.id;
            currentPageId.value = nextPageId;
            router.push({
                name: 'CourseCompletionPage',
                params: {
                    courseId,
                    moduleId: nextModule.id,
                    pageId: nextPageId
                }
            });
        }
    }
};

const completeModule = () => {
    endOfModule.value = true;
};

const completeCourse = () => {
    endOfCourse.value = true;
};

const checkQuiz = async () => {
    try {
        if (!currentPageData.value?.questions?.length) return;

        const answersToSend = [];
        let allCorrect = true;
        quizWasChecked.value = true;

        currentPageData.value.questions.forEach((question, qIndex) => {
            quizChecked.value[qIndex] = true;

            if (!question.variants?.length) {
                quizPassed.value[qIndex] = true;
                return;
            }

            const userAnswers = [...(selectedAnswers.value[qIndex] || [])].sort();
            const correctAnswers = question.variants
                .filter(v => v.is_right)
                .map(v => v.id)
                .sort();

            const isCorrect =
                userAnswers.length === correctAnswers.length &&
                userAnswers.every((val, idx) => val === correctAnswers[idx]);

            quizPassed.value[qIndex] = isCorrect;
            quizzesCompleted.value[qIndex] = isCorrect;
            allCorrect = allCorrect && isCorrect;

            userAnswers.forEach(variantId => {
                answersToSend.push({
                    question_id: question.id,
                    variant_id: variantId,
                    is_correct: correctAnswers.includes(variantId)
                });
            });
        });

        if (answersToSend.length) {
            await sendAnswer({
                answers: answersToSend,
                is_completed: allCorrect
            });
        }

        if (allCorrect && currentModule.value) {
            currentModule.value.pages[currentPageIndex.value].completed = true;
        }

        return allCorrect;
    } catch (error) {
        console.error('Ошибка при проверке теста:', error);
        throw error;
    }
};

watch(() => route.params.moduleId, (newId) => {
    if (newId && newId !== currentModuleId.value) {
        currentModuleId.value = newId;
    }
});

watch(() => route.params.pageId, (newId) => {
    if (newId && newId !== currentPageId.value) {
        currentPageId.value = Number(newId);
        loadPageContent();
        console.log(currentModuleId.value, currentPageId.value, currentPageData.value)
    }
});

onMounted(fetchMaterial);
provide('material', material);
provide('course', course);
</script>

<style scoped lang="scss">
.card {
    width: 100%;
    gap: 15px;

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

        .qiuz {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .quiz-result {
            margin-top: 10px;
        }
    }

    .action-buttons {
        gap: 10px;

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
