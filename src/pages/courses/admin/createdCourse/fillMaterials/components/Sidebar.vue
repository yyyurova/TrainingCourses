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
            <div v-for="(module, index) in material.modules" :key="index" class="chapter">
                <div class="chapter-header" @click="toggleChapter(index)">
                    <span>{{ index + 1 + '. ' + module.title }}</span>
                    <img src="/icons/arrow.svg" class="arrow-up" :class="{ 'arrow-down': openChapters[index] }" alt="">
                </div>

                <div class="pages" v-if="module.pages" v-show="openChapters[index]">
                    <RouterLink v-for="(page, pageIndex) in module.pages" :key="pageIndex"
                        :to="`/course-fill-materials/${course.id}/module/${module.id}/page/${page.id}`"
                        class="page-link" active-class="active-page">
                        <div class="page-content">
                            {{ index + 1 + '.' + (pageIndex + 1) + ' ' + page.title }}
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { inject, ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    isMobile: Boolean,
    isActive: Boolean,
});

const emit = defineEmits(['close']);

const material = inject('material');
const course = inject('course');

const isSmallScreen = ref(false);
const openChapters = ref({});

const toggleChapter = (index) => {
    openChapters.value = {
        ...openChapters.value,
        [index]: !openChapters.value[index]
    };
};

watch(
    () => material.value,
    (newMaterial) => {
        if (newMaterial?.modules?.length) {
            openChapters.value = { 0: true };
        }
    },
    { immediate: true }
);

const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 1280;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});
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

            .pages {
                display: flex;
                flex-direction: column;
                gap: 2px;
                margin-top: 2px;
                padding-left: 8px;
                margin-left: 16px;

                .page-link {
                    text-decoration: none;
                    color: inherit;

                    .page-content {
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

                    &.active-page .page-content {
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