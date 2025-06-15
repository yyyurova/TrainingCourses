<template>
    <CourseCompletionLayout>
        <EndOfModule v-if="endOfModule && !endOfCourse" @next="goToNextModule" />
        <EndOfCourse v-if="endOfCourse" />

        <Card v-if="currentModule && !endOfModule && !endOfCourse" class="no-hover"
            :style="!material ? 'height:100vh' : ''">
            <h1 class="moduleName">
                {{ currentModule.title }}
                <span class="score">{{ completedPages + " из " + currentModule.pages.length + " шагов пройдено"
                    }}</span>
            </h1>
            <h2 v-if="currentPageData" class="pageName">{{ currentPageData.title }}</h2>
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
                                    <input :type="question.is_group === 1 ? 'checkbox' : 'radio'"
                                        v-model="selectedAnswers[qIndex]" :value="variant.id">
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
                <button @click="checkQuiz" :disabled="(hasQuizzes && !hasSelectedAnswers) || loading">
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
import { computed, onMounted, ref, watch, provide, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourseActivity } from '@/api/modules/activity.api';
import { getCourse } from '@/api/modules/courses.api';
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

const selectedAnswers = reactive({});
const quizChecked = ref({});
const quizPassed = ref({});
const quizWasChecked = ref(false);
const quizzesCompleted = ref({});

const currentModuleId = ref(null);
const currentPageId = ref(null);

const currentModule = computed(() => {
    return material.value?.find(m => Number(m.id) === Number(currentModuleId.value)) || null;
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
    return Object.values(selectedAnswers).some(answers => answers?.length > 0);
});

const resetQuizState = () => {
    Object.keys(selectedAnswers).forEach(key => delete selectedAnswers[key]);
    Object.keys(quizChecked.value).forEach(key => delete quizChecked.value[key]);
    Object.keys(quizPassed.value).forEach(key => delete quizPassed.value[key]);
    quizWasChecked.value = false;
};

const formatTextContent = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
};

const loadPageContent = async () => {
    if (!currentModuleId.value || !currentPageId.value) {
        console.error('Missing moduleId or pageId');
        return;
    }

    try {
        loading.value = true;
        resetQuizState();
        const pageData = await getModulePage(currentModuleId.value, currentPageId.value);
        if (!pageData) {
            console.error('Page data not found');
            if (currentModule.value?.pages?.length) {
                const firstPageId = currentModule.value.pages[0].id;
                router.replace({
                    params: {
                        pageId: firstPageId
                    }
                });
                return;
            }
        }

        currentPageData.value = pageData;

        if (currentPageData.value?.questions) {
            currentPageData.value.questions.forEach((_, index) => {
                selectedAnswers[index] = []; // без .value!
                quizChecked.value[index] = false;
                quizPassed.value[index] = false;
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        // Перенаправляем на первую страницу модуля в случае ошибки
        if (currentModule.value?.pages?.length) {
            const firstPageId = currentModule.value.pages[0].id;
            router.replace({
                params: {
                    pageId: firstPageId
                }
            });
        }
    } finally {
        loading.value = false;
    }
};

const fetchMaterial = async () => {
    try {
        loading.value = true;

        const [courseResponse, modulesResponse] = await Promise.all([
            getCourse(courseId),
            getModules(courseId)
        ]);
        course.value = courseResponse;
        material.value = modulesResponse;

        await fetctActivity();

        let latestActivity = null;
        if (activity.value && activity.value.length > 0) {
            latestActivity = activity.value.reduce((latest, current) => {
                const latestDate = new Date(latest.created_at);
                const currentDate = new Date(current.created_at);
                return currentDate > latestDate ? current : latest;
            });
        }
        // Устанавливаем текущий модуль и страницу
        currentModuleId.value = route.params.moduleId ||
            (latestActivity?.course_module_id || material.value[0].id);

        const targetModule = material.value.find(m => Number(m.id) === Number(currentModuleId.value));
        if (!targetModule) {
            console.error('Target module not found, falling back to first module');
            currentModuleId.value = material.value[0].id;
            currentPageId.value = material.value[0].pages[0]?.id;
        } else {
            currentPageId.value = route.params.pageId ||
                (latestActivity?.course_module_page_id || targetModule.pages[0]?.id);

            if (!currentPageId.value && targetModule.pages?.length) {
                currentPageId.value = targetModule.pages[0].id;
            }
        }

        if (route.params.moduleId !== currentModuleId.value || route.params.pageId !== currentPageId.value) {
            await router.replace({
                name: 'CourseCompletionPage',
                params: {
                    courseId,
                    moduleId: currentModuleId.value,
                    pageId: currentPageId.value
                }
            });
        }

        await loadPageContent();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    } finally {
        loading.value = false;
    }
};

const fetctActivity = async () => {
    try {
        activity.value = await getCourseActivity(courseId);
    } catch (error) {
        console.log('Activity not found, continuing without it');
        activity.value = null;
    }
}

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

const completeModule = async () => {
    endOfModule.value = true;
    await fetctActivity()
};

const completeCourse = async () => {
    endOfCourse.value = true;
    await fetctActivity()
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

            const userAnswers = [...(selectedAnswers[qIndex] || [])].sort();
            const correctAnswers = question.variants
                .filter(v => v.is_right)
                .map(v => v.id)
                .sort();

            // Для вопроса с одним ответом проверяем точное совпадение
            // Для вопроса с несколькими ответами проверяем, что все выбранные ответы правильные
            const isCorrect = question.is_group
                ? userAnswers.every(answer => correctAnswers.includes(answer)) &&
                userAnswers.length === correctAnswers.length
                : userAnswers.length === 1 && correctAnswers.includes(userAnswers[0]);

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

        return allCorrect;
    } catch (error) {
        console.error('Ошибка при проверке теста:', error);
        throw error;
    }
};
watch(() => route.params, async (newParams) => {
    if (newParams.moduleId && Number(newParams.moduleId) !== Number(currentModuleId.value)) {
        currentModuleId.value = Number(newParams.moduleId);
        const newModule = material.value?.find(m => m.id === currentModuleId.value);
        if (newModule?.pages?.length) {
            currentPageId.value = newModule.pages[0].id;
            await router.replace({
                params: {
                    pageId: currentPageId.value
                }
            });
        }
    } else if (newParams.pageId && Number(newParams.pageId) !== Number(currentPageId.value)) {
        currentPageId.value = Number(newParams.pageId);
        await loadPageContent();
    }
}, { immediate: true, deep: true });

onMounted(async () => {
    await fetchMaterial()
});

provide('material', material);
provide('course', course);
provide('activity', activity)
</script>

<style scoped lang="scss">
.card {
    width: 100%;
    gap: 15px;

    .moduleName {
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

    .pageName {
        font-size: 18px;
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
