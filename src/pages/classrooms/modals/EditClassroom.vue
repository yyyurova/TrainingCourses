<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Редактировать учебный класс</h2>
                <div class="form-group">
                    <label>Название<span class="required">*</span></label>
                    <input v-model="classroomName" type="text" autocomplete="off" required>
                </div>
                <div class="modal-buttons">
                    <button class="transparent" @click="cancel">Отмена</button>
                    <button class="blue" @click="save">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['cancel', 'edit']);

const props = defineProps({
    classroom: {
        type: Object,
        required: true
    }
});

const classroomName = ref(props.classroom.title);

const cancel = () => {
    emit('cancel');
};

const save = () => {
    const classroomData = {
        title: classroomName.value,
        id: props.classroom.id,
        course_id: props.classroom.course.id
    };
    emit('edit', classroomData);
};
</script>

<style scoped lang="scss">
.card {
    width: 100%;

    img {
        width: 100%;
        height: auto;
        max-height: 200px;
        object-fit: cover;
    }

    button {
        border: 1px solid #513DEB;
    }
}

.form-group {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
}
</style>