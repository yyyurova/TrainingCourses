<template>

    <div class="container">
        <div class="mobile-header" v-if="isMobile">
            <div class="logo">
                <img src="/icons/logo.svg" alt="Logo">
            </div>
            <button class="burger-menu" @click="toggleSidebar">
                ☰
            </button>
        </div>
        <Sidebar :isMobile="isMobile" :isActive="sidebarVisible" @close="sidebarVisible = false" />

        <div class="content">
            <div class="content__inner">
                <slot></slot>
            </div>
        </div>
        <div class="sidebar-overlay" v-if="isMobile && sidebarVisible" @click="toggleSidebar"></div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isMobile = ref(false)
const sidebarVisible = ref(false)

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 930
}

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
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
.container {
    display: flex;
    min-height: 100vh;

    .content {
        overflow-x: hidden;
        width: 100%;
        flex-grow: 1;
        margin-left: 24px;
        background-color: #ffffff;

        .content__inner {
            width: 100%;
        }
    }

    &:has(.mobile-header) {
        flex-direction: column;

        .content {
            margin: 10px 0 0 0 !important;
        }
    }

    .sidebar-hidden {
        transform: translateX(-100%);
    }

    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }


}

@media (max-width: 930px) {
    .mobile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 2px 0px #0000001A;
        box-shadow: 0px 2px 2px 0px #00000033;

        .logo img {
            width: 50px;
            height: auto;
        }

        .burger-menu {
            background: none;
            border: none;
            cursor: pointer;

            img {
                width: 24px;
                height: 24px;
            }
        }
    }


    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 10000;
        transition: transform 0.3s ease;
    }
}
</style>