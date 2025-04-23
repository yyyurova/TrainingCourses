<template>
    <aside class="sidebar">
        <div class="logo">
            <img src="/icons/logo.svg" alt="Logo">
        </div>
        <div class="navigation">
            <RouterLink :to="item.linkTo" v-for="(item, index) in sidebarContent.admin" :key="index" class="link">
                <div>
                    <img width="24" height="24" :src="item.imageUrl" alt="">
                    <span>{{ item.name }}</span>
                </div>
            </RouterLink>
        </div>
        <div class="user">
            <img class="avatar" src="/avatar.png" alt="User-Avatar">
            <span>UserName</span>
            <img src="/icons/menu-vertical.svg" alt="">
        </div>
    </aside>
</template>

<script setup>
import { sidebarContent } from '../static.js'

console.log(sidebarContent)
</script>

<style scoped lang="scss">
.sidebar {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 300px;
    padding: 20px 8px;
    background-color: #F8F8F8;

    .logo {
        padding: 0 20px;

        img {
            width: 68px;
            height: 78px;
        }
    }

    .navigation {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 10px;

        .link {
            border-radius: 8px;
            text-decoration: none;
            padding: 5px;

            &.router-link-active div {
                background-color: #E9F2FF;
            }

            div {
                display: flex;
                gap: 8px;
                align-items: center;
                padding: 8px 20px;
            }
        }
    }

    .user {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-left: 20px;
        margin-top: 20px;
        cursor: pointer;

        img.avatar {
            width: 36px;
            height: auto;
            border-radius: 4px;
        }
    }
}
</style>