<template>
    <div class="filter-modal">
        <div>
            <div class="search-block">
                <input @click.stop="" v-model="emailInput" type="email" placeholder="Введите email для поиска">

                <button class="icon" @click="handleClick(emailInput)">
                    <img src="/icons/search.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const emit = defineEmits(['filter'])
const emailInput = ref('')

const handleClick = (email) => {
    emit('filter', email);
};
</script>

<style scoped lang="scss">
.filter-modal {
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