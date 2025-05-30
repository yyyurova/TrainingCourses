<template>
    <aside v-if="course" class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'active': isActive }">
        <div class="top-row">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="close-sidebar icon" v-if="isMobile" @click="$emit('close')">×</button>
        </div>

        <p class="course-name">{{ course.name }}</p>
        <RouterLink :to="`/course-fill-content/${course.id}`">
            <button class="transparent go-back">
                <img src="/icons/arrow.svg" class="arrow-left" alt="">
                {{ isSmallScreen ? 'Вернуться к содержанию' : 'Вернуться к содержанию курса' }}
            </button>
        </RouterLink>

        <div class="navigation" v-if="material">
            <div v-for="(chapter, index) in material.chapters" :key="index" class="chapter">
                <div class="chapter-header" @click="toggleChapter(index)">
                    <span>{{ index + 1 + '. ' + chapter.name }}</span>
                    <img src="/icons/arrow.svg" class="arrow-up" :class="{ 'arrow-down': openChapters[index] }" alt="">
                </div>

                <div class="steps" v-if="chapter.steps" v-show="openChapters[index]">
                    <RouterLink v-for="(step, stepIndex) in chapter.steps" :key="stepIndex"
                        :to="`/course-fill-materials/${course.id}/${index}/${stepIndex}`" class="step-link"
                        active-class="active-step">
                        <div class="step-content">
                            {{ index + 1 + '.' + (stepIndex + 1) + ' ' + step.name }}
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    isMobile: Boolean,
    isActive: Boolean,
});

const route = useRoute()
const router = useRouter()

const material = inject('material')
const course = inject('course')

const emit = defineEmits(['close']);

const isSmallScreen = ref(false)

const openChapters = ref({})

const toggleChapter = (index) => {
    openChapters.value = {
        ...openChapters.value,
        [index]: !openChapters.value[index]
    }
}

watch(
    () => material.value,
    (newMaterial) => {
        if (newMaterial?.chapters?.length) {
            openChapters.value = { 0: true }
        }
    },
    { immediate: true }
)

const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 1280
}

onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize)
})

</script>

<style scoped lang="scss">
.sidebar {
    transition: transform 0.3s ease;
    position: relative;
    display: flex;
    gap: 10px;
    flex-direction: column;
    min-width: 360px;
    width: 360px;
    padding: 20px 8px;
    background-color: #F8F8F8;
    overflow-x: auto;
    min-height: 100vh;

    &.sidebar-mobile {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        transform: translateX(-100%);
        width: 95%;

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

    .course-name {
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
    }

    a {
        text-decoration: none;
    }

    button.go-back {
        border: 1px solid #513DEB;
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
                        // color: #513DEB;
                    }
                }
            }
        }
    }
}

@media (max-width: 1280px) {
    .sidebar {
        min-width: 300px;
        width: 300px;
    }
}
</style>