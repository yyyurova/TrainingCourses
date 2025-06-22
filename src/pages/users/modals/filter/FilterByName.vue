<template>
    <div class="filter-modal" @click.stop="">
        <div>
            <div class="search-block">
                <input @input="handleInput" v-model="nameInput" type="text" placeholder="Введите имя для поиска">

                <button class="icon" @click="handleClick(nameInput)">
                    <img src="/icons/actions/search.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filter'])

const nameInput = ref('')

const handleClick = (name) => {
    emit('filter', name);
};
</script>

<style scoped lang="scss">
.filter-modal {
    width: 410px;
    padding: 10px;

    button.icon {
        padding: 5px;

        &:hover {
            background-color: #E9F2FF;
        }

        img {
            width: 27px;
        }
    }
}
</style>