<template>
    <aside class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'active': isActive }">
        <div class="top-row">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="close-sidebar icon" v-if="isMobile" @click="$emit('close')">×</button>
        </div>
        <h3>{{ course?.title || 'Название курса' }}</h3>
        <button class="transparent border" @click="goBack">
            <img src="/icons/arrow.svg" class="arrow-left" alt="">
            Вернуться к курсу
        </button>

        <div class="navigation" v-if="material && activity">
            <div v-for="module in material" :key="module.id" class="chapter">
                <div class="chapter-header" @click="toggleChapter(module.id)">
                    <span>{{ getModuleNumber(module) + '. ' + module.title }}</span>
                    <img src="/icons/arrow.svg" class="arrow-up" :class="{ 'arrow-down': openModules[module.id] }"
                        alt="">
                </div>

                <div class="steps" v-if="module.pages" v-show="openModules[module.id]">
                    <RouterLink v-for="page in module.pages" :key="page.id" class="step-link"
                        :to="getPageRoute(module.id, page.id)" active-class="active-step">
                        <div class="step-content" :class="{
                            'done': isPageDone(module.id, page.id),
                            'active': isCurrentPage(module.id, page.id)
                        }">
                            {{ getModuleNumber(module) + '.' + getPageNumber(module, page) + ' ' + page.title }}
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

const props = defineProps({
    isMobile: Boolean,
    isActive: Boolean,
});

const emit = defineEmits(['close']);

const route = useRoute()
const router = useRouter()

const material = inject('material')
const course = inject('course')
const activity = inject('activity')

const openModules = ref({})

const completedPages = computed(() => {
    if (!activity.value) return new Set();
    return new Set(activity.value.map(item => item.course_module_page_id));
});

const isPageDone = (moduleId, pageId) => {
    return completedPages.value.has(pageId);
};

const isCurrentPage = (moduleId, pageId) => {
    return route.params.pageId == pageId;
};

const initOpenModules = () => {
    if (!material.value) return
    material.value.forEach(module => {
        openModules.value[module.id] = material.value.indexOf(module) === 0
    })
}

const getModuleNumber = (module) => {
    if (!material.value) return 0
    return material.value.indexOf(module) + 1
}

const getPageNumber = (module, page) => {
    if (!module.pages) return 0
    return module.pages.indexOf(page) + 1
}

const getPageRoute = (moduleId, pageId) => {
    return {
        name: 'CourseCompletionPage',
        params: {
            courseId: route.params.courseId,
            moduleId: moduleId,
            pageId: pageId
        }
    }
}

const toggleChapter = (moduleId) => {
    openModules.value = {
        ...openModules.value,
        [moduleId]: !openModules.value[moduleId]
    }
}

const goBack = () => {
    router.push('/courses')
}

const currentModuleId = computed(() => {
    return route.params.moduleId
})

watch(
    () => [material.value, currentModuleId.value],
    () => {
        if (material.value && currentModuleId.value) {
            // Закрываем все модули
            Object.keys(openModules.value).forEach(key => {
                openModules.value[key] = false
            })
            // Открываем текущий модуль
            openModules.value[currentModuleId.value] = true
        }
    },
    { immediate: true }
)

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

    &.sidebar-mobile {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        transform: translateX(-100%);
        width: 95%;
        height: 100vh;
        overflow-x: auto;

        &.active {
            transform: translateX(0);
        }
    }

    .top-row {
        padding-top: 10px;
        padding-right: 20px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        button.close-sidebar {
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
        }

        .logo {
            padding: 0 20px;

            img {
                width: 68px;
                height: 78px;
            }
        }
    }

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
                    padding: 5px;

                    .step-content {
                        padding: 10px 16px 10px 16px;
                        border-radius: 6px;
                        transition: all 0.2s ease;
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 20px;
                        letter-spacing: 0px;
                        color: #292929;

                        &.active {
                            background-color: #E9F2FF;
                            color: #292929;
                        }

                        &.done {
                            background-color: #29a159;
                            color: #fff;
                        }

                        &:hover {
                            background-color: #E9F2FF;
                            color: #292929;
                        }
                    }
                }
            }
        }
    }
}
</style>