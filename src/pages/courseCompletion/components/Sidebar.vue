<template>
    <aside class="sidebar">
        <div class="logo">
            <img src="/icons/logo.svg" alt="Logo">
        </div>
        <h3>{{ course?.name || 'Название курса' }}</h3>
        <button class="transparent" @click="goBack">
            <img src="/icons/arrow.svg" class="arrow-left" alt="">
            Вернуться к курсу
        </button>

        <div class="navigation" v-if="material">
            <div v-for="(chapter, index) in material.chapters" :key="index" class="chapter">
                <div class="chapter-header" @click="toggleChapter(index)">
                    <span>{{ index + 1 + '. ' + chapter.name }}</span>
                    <img src="/icons/arrow.svg" class="arrow-up" :class="{ 'arrow-down': openChapters[index] }" alt="">
                </div>

                <div class="steps" v-if="chapter.steps" v-show="openChapters[index]">
                    <div v-for="(step, stepIndex) in chapter.steps" :key="stepIndex" class="step-link"
                        active-class="active-step">
                        <div class="step-content">
                            {{ index + 1 + '.' + (stepIndex + 1) + ' ' + step.name }}
                        </div>
                    </div>
                    <!-- <RouterLink :to="`/courseCompletion/${route.params.courseId}/${index}/${stepIndex}`"
                        v-for="(step, stepIndex) in chapter.steps" :key="stepIndex" class="step-link"
                        active-class="active-step">

                    </RouterLink> -->
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const material = inject('material')
const course = inject('course')

const currentCourse = ref(null)
const openChapters = ref({})

const toggleChapter = (index) => {
    openChapters.value = {
        ...openChapters.value,
        [index]: !openChapters.value[index]
    }
}

const goBack = () => {
    router.back()
}

watch(
    () => [material.value, route.params.courseId],
    () => {
        if (!material.value || !route.params.courseId) return

        const courseId = course.id

        const materialEntry = Object.values(material.value).find(
            courseMaterial => courseMaterial?.courseId === courseId
        )

        if (materialEntry) {
            currentCourse.value = materialEntry
            if (currentCourse.value.chapters?.length) {
                openChapters.value = { 0: true }
            }
        } else {
            currentCourse.value = null
        }
    },
    { immediate: true }
)
</script>

<style scoped lang="scss">
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 300px;
    width: 300px;
    padding: 20px 8px;
    background-color: #F8F8F8;
    min-height: 100vh;
    box-sizing: border-box;
    overflow-y: auto;

    h3 {
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
    }

    .logo {
        padding: 0 20px;
        margin-bottom: 10px;

        img {
            width: 68px;
            height: 78px;
        }
    }

    .transparent {
        border: 1px solid #513DEB;
        transition: all 0.2s ease;
    }

    .navigation {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .chapter {
            border-radius: 8px;
            overflow: hidden;

            .chapter-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;

                &:hover {
                    background-color: #E9F2FF;
                }

                .arrow {
                    transition: transform 0.3s ease;
                }

                span {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
                    text-align: center;
                }
            }

            .steps {
                display: flex;
                flex-direction: column;
                gap: 2px;
                margin-top: 2px;
                padding-left: 8px;
                margin-left: 16px;

                .step-link {
                    text-decoration: none;
                    color: inherit;

                    .step-content {
                        padding: 10px 16px 10px 16px;
                        border-radius: 6px;
                        transition: all 0.2s ease;
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 20px;
                        letter-spacing: 0px;

                        &:hover {
                            background-color: #E9F2FF;
                        }
                    }

                    &.active-step .step-content {
                        background: #E9F2FF;
                        font-weight: 500;
                        color: #513DEB;
                    }
                }
            }
        }
    }
}
</style>