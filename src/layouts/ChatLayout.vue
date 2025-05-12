<template>
    <div class="container">
        <Sidebar />
        <div class="content">
            <div class="content__inner">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
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
}
</style>