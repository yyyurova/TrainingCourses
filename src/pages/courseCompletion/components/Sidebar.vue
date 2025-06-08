<template>
    <aside class="sidebar">
        <div class="logo">
            <img src="/icons/logo.svg" alt="Logo">
        </div>
        <h3>{{ course?.title || 'Название курса' }}</h3>
        <button class="transparent border" @click="goBack">
            <img src="/icons/arrow.svg" class="arrow-left" alt="">
            Вернуться к курсу
        </button>

        <div class="navigation" v-if="material">
            <div v-for="(module, moduleIndex) in material" :key="moduleIndex" class="chapter">
                <div class="chapter-header" @click="toggleChapter(moduleIndex)">
                    <span>{{ moduleIndex + 1 + '. ' + module.title }}</span>
                    <img src="/icons/arrow.svg" class="arrow-up" :class="{ 'arrow-down': openModules[moduleIndex] }"
                        alt="">
                </div>

                <div class="steps" v-if="module.pages" v-show="openModules[moduleIndex]">
                    <RouterLink v-for="(page, pageIndex) in module.pages" :key="pageIndex" class="step-link"
                        :to="getPageRoute(moduleIndex, pageIndex)" active-class="active-step">
                        <div class="step-content">
                            {{ moduleIndex + 1 + '.' + (pageIndex + 1) + ' ' + page.title }}
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { inject, ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const material = inject('material')
const course = inject('course')

const openModules = ref({})

const initOpenModules = () => {
    if (!material.value) return
    material.value.forEach((_, index) => {
        openModules.value[index] = index === 0
    })
}

const getPageRoute = (moduleIndex, pageIndex) => {
    return {
        name: 'CourseCompletion',
        params: {
            courseId: route.params.courseId,
            moduleIndex: moduleIndex,
            pageIndex: pageIndex
        }
    }
}

const toggleChapter = (index) => {
    openModules.value = {
        ...openModules.value,
        [index]: !openModules.value[index]
    }
}

const goBack = () => {
    router.push('/courses')
}

const currentModuleIndex = computed(() => {
    return parseInt(route.params.moduleIndex) || 0
})

watch(
    () => [material.value, currentModuleIndex.value],
    () => {
        if (material.value && currentModuleIndex.value !== undefined) {
            // Закрываем все модули
            Object.keys(openModules.value).forEach(key => {
                openModules.value[key] = false
            })
            // Открываем текущий модуль
            openModules.value[currentModuleIndex.value] = true
        }
    },
    { immediate: true }
)

// Инициализация при монтировании
onMounted(initOpenModules)
</script>

<style scoped lang="scss">
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 300px;
    width: 300px;
    padding: 20px 10px;
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
                    // text-align: center;
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
                }
            }
        }
    }
}
</style>