<template>
    <div class="card course">
        <div class="top">
            <div class="course-info">
                <img src="" alt="">
                <span class="name-of-course">{{ course.name }}</span>
            </div>
            <div class="action-buttons">
                <button class="icon edit-course">
                    <img src="/icons/pen.svg" alt="">
                </button>
                <button class="icon delete-course">
                    <img src="/icons/delete.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    course: Object
})
</script>

<style scoped lang="scss">
.card {
    display: flex;
    width: 504px;
    border-radius: 10px;
    padding: 20px;
    margin: 10px;
    border: 1px solid #D9D9D9;
    flex-direction: column;
    align-items: flex-start;


}
</style>