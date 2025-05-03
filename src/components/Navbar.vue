<template>
    <nav class="menu">
        <ul>
            <li v-for="element in elements" :key="element.name">
                <RouterLink :to="element.linkTo">
                    {{ element.name }}
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
defineProps({
    elements: Array,
    required: true
})
</script>

<style scoped lang="scss">
.menu {
    padding: 10px 0;
    border-bottom: 1px solid #D9D9D9;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    & ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        width: 100%;

        li {
            white-space: nowrap;
            text-align: center;
            position: relative;
            padding: 10px 20px;
            display: block;
            font-weight: 400;
            font-size: 16px;
            line-height: 130%;
            text-align: center;
            cursor: pointer;

            a {
                text-decoration: none;
            }


            &>.router-link-active::after {
                content: '';
                display: block;
                width: 100%;
                height: 1px;
                background-color: #513DEB;
                position: absolute;
                bottom: -10px;
                left: 0;
            }

        }
    }
}
</style>