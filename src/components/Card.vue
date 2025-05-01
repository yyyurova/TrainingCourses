<template>
    <div class="card">
        <slot></slot>
    </div>
</template>


<style scoped lang="scss">
.card {
    display: flex;
    width: 477px;
    border-radius: 10px;
    padding: 20px;
    margin: 0;
    border: 1px solid #D9D9D9;
    flex-direction: column;
    align-items: flex-start;

    &:hover:not(.card.no-hover) {
        background-color: #EEEEEE;
    }
}
</style>