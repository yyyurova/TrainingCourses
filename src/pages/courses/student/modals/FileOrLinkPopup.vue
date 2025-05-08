<template>
    <div class="popup">
        <ul class="list">
            <li class="element" @click="() => emit('file')">
                <p class="label">Файл</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.1667 3V7.5C13.1667 8.12132 13.689 8.625 14.3333 8.625H19M13.3668 3H7.33333C6.04467 3 5 4.00736 5 5.25V18.75C5 19.9926 6.04467 21 7.33333 21H16.6667C17.9553 21 19 19.9926 19 18.75V8.43198C19 7.83524 18.7542 7.26295 18.3166 6.84099L15.0168 3.65901C14.5792 3.23705 13.9857 3 13.3668 3Z"
                        stroke="#0C0C0C" />
                </svg>
            </li>
            <li class="element" @click="() => emit('link')">
                <p class="label">Ссылка</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 16H17C19.2091 16 21 14.2091 21 12C21 9.79086 19.2091 8 17 8H15" stroke="#292929"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8 12H16" stroke="#292929" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 8H7C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16H9" stroke="#292929"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.popup {
    position: absolute;
    background-color: #fff;
    border: 1px solid #D9D9D9;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 8px 0;
    transition: all 0.3s ease;

    .list {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0px 10px;
        margin: 0;

        .element {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #141414;
            gap: 10px;
            transition: all 0.3s ease-out;
            padding: 4px 7px;
            border-radius: 6px;
            cursor: pointer;

            &:hover {
                background-color: #f5f5f5;
            }
        }
    }
}
</style>

<script setup>
const emit = defineEmits(['file', 'link'])
</script>