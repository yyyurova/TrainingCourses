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
import Sidebar from '../components/Sidebar.vue'
</script>

<style lang="scss">
.container {
    display: flex;
    min-height: 100vh;

    .content {
        overflow-x: hidden;
        width: 100%;
        flex-grow: 1;
        margin-top: 55px;
        margin-left: 15px;
        background-color: #ffffff;
        padding-left: 10px;

        .content__inner {
            width: 100%;
        }
    }
}
</style>