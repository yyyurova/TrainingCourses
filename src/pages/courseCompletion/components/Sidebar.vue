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
            <div v-for="(module, index) in material" :key="index" class="chapter">
                <div class="chapter-header" :class="{ 'locked': isModuleLocked(module) }"
                    @click="!isModuleLocked(module) && toggleChapter(module.id)">

                    <span>{{ getModuleNumber(module) + '. ' + module.title }}</span>

                    <template v-if="isModuleLocked(module)">
                        <img src="/icons/lock.svg" alt="locked" class="lock-icon">
                    </template>
                    <template v-else>
                        <img src="/icons/arrow.svg" class="arrow-up" :class="{ 'arrow-down': openModules[module.id] }"
                            alt="">
                    </template>
                </div>

                <div class="steps" v-if="module.pages" v-show="openModules[module.id] && !isModuleLocked(module)">
                    <RouterLink v-for="page in module.pages" :key="page.id" class="step-link"
                        :to="getPageRoute(module.id, page.id)" active-class="active-step"
                        :class="{ 'disabled-link': isModuleLocked(module) }">
                        <div class="step-content" :class="{
                            'done': isPageDone(module.id, page.id),
                            'active': isCurrentPage(module.id, page.id),
                            'locked-step': isModuleLocked(module)
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
const isCurrentModuleCompleted = inject('isCurrentModuleCompleted')

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

const isModuleCompleted = (module) => {
    if (!module.pages || !activity.value) return false;
    const completedPages = new Set(activity.value.map(item => item.course_module_page_id));
    return module.pages.every(page => completedPages.has(page.id));
};

const isModuleLocked = (module) => {
    if (material.value.indexOf(module) === 0) return false;

    const prevModuleIndex = material.value.indexOf(module) - 1;
    const prevModule = material.value[prevModuleIndex];

    return !isModuleCompleted(prevModule);
};

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
            Object.keys(openModules.value).forEach(key => {
                openModules.value[key] = false
            })
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

                &:has(.lock-icon) {
                    cursor: not-allowed;
                }

                &:hover {
                    background-color: #E9F2FF;
                }

                .arrow {
                    transition: transform 0.3s ease;
                }

                .lock-icon {
                    width: 24px;
                    height: 24px;
                }

                span {
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 20px;
                    letter-spacing: 0px;
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