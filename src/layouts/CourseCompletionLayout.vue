<template>
    <main>
        <div class="container">
            <Sidebar />
            <div class="content">
                <div class="content__inner">
                    <slot></slot>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import Sidebar from '@/pages/courseCompletion/components/Sidebar.vue';

</script>

<style scoped lang="scss">
.container {
    display: flex;
    min-height: 100vh;

    .content {
        overflow-x: hidden;
        width: 100%;
        flex-grow: 1;
        margin: 55px 24px 20px 24px;
        background-color: #ffffff;

        .content__inner {
            width: 100%;
        }
    }
}
</style>