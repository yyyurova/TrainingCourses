    <template>
        <Layout>
            <div class="task" v-if="!isLoading && task">
                <div class="left ">
                    <FullTask />
                    <Comment />
                </div>
                <div class="right ">
                    <MyTasks @openLinkModal="openLinkModal" @openFileModal="openFileModal" />
                </div>
            </div>
            <Loading v-if="isLoading" />
            <FileUploadModal v-if="showFileUploadModal" @cancel="closeModal" @add="addUploadedFile" />
            <EnterLinkModal v-if="showEnterLinkModal" @cancel="closeModal" @add="addLink" />
        </Layout>
    </template>

<script setup>
import axios from 'axios';
import { computed, onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';

import Layout from '@/layouts/Layout.vue';
import Loading from '@/components/Loading.vue';
import FileUploadModal from '../modals/FileUploadModal.vue';
import EnterLinkModal from '../modals/EnterLinkModal.vue';
import FullTask from './components/FullTask.vue';
import Comment from './components/Comment.vue';
import MyTasks from './components/MyTasks.vue';

const isLoading = ref(false)
const course = ref(null)

const route = useRoute()

const showChoicePopup = ref(false)
const showFileUploadModal = ref(false)
const showEnterLinkModal = ref(false)

const uploadedFiles = ref([]);
const enteredLinks = ref([])

const task = computed(() => {
    if (!course.value?.tasks) return {};
    return course.value.tasks.find(task => task.id.toString() === route.params.taskId.toString()) || {};
});

const fetchCourse = async (id) => {
    try {
        isLoading.value = true;
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/courses/${id}`);
        course.value = data;
    } catch (error) {
        console.error('Ошибка загрузки курса:', error);
    } finally {
        isLoading.value = false;
    }
};


const openFileModal = () => {
    showChoicePopup.value = false;
    showFileUploadModal.value = true;
};

const openLinkModal = () => {
    showChoicePopup.value = false
    showEnterLinkModal.value = true
}

const closeModal = () => {
    if (showFileUploadModal.value) { showFileUploadModal.value = false }
    if (showEnterLinkModal.value) { showEnterLinkModal.value = false }
}

const handleClickOutside = (e) => {
    if (!e.target.closest('.popup') && !e.target.closest('.add')) {
        showChoicePopup.value = false
    }
}

const addUploadedFile = (file) => {
    uploadedFiles.value.push(file);
    showFileUploadModal.value = false;
};

const addLink = (link) => {
    enteredLinks.value.push(link)
    showEnterLinkModal.value = false
}

provide('task', task)
provide('course', course)
provide('showChoicePopup', showChoicePopup)
provide('uploadedFiles', uploadedFiles)
provide('enteredLinks', enteredLinks)

onMounted(async () => {
    if (route.params.id) {
        await fetchCourse(route.params.id);
    }

    document.addEventListener('click', handleClickOutside)
});
</script>

<style scoped lang="scss">
.task {
    width: 100%;
    display: flex;
    gap: 15px;

    h2 {
        font-weight: 600;
        font-size: 42px;
        line-height: 50px;
        letter-spacing: 1px;

    }

    .left,
    .right {
        width: 50%;

        .card {
            width: 100%;
        }
    }

    .right:not(.message.right) {
        max-width: 600px;
    }

    .left:not(.message.left) {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
}
</style>