    <template>
        <Layout>
            <div class="task" v-if="task">
                <FullTask />
                <MyTasks @openLinkModal="openLinkModal" @openFileModal="openFileModal" />
                <Comment />
            </div>
            <Loading v-if="isLoading" />
            <FileUploadModal v-if="showFileUploadModal" @cancel="closeModal" @add="addUploadedFile" />
            <EnterLinkModal v-if="showEnterLinkModal" @cancel="closeModal" @add="addLink" />
        </Layout>
    </template>

<script setup>
import { onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getTask } from '@/api/modules/tasks.api';

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

const task = ref(null)

const fetchTask = async (id) => {
    try {
        isLoading.value = true;
        task.value = await getTask(id);
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
        await fetchTask(route.params.id);
    }

    document.addEventListener('click', handleClickOutside)
});
</script>

<style scoped lang="scss">
// .task {
//     width: 100%;
//     display: flex;
//     gap: 15px;

//     h2 {
//         font-weight: 600;
//         font-size: 42px;
//         line-height: 50px;
//         letter-spacing: 1px;
//     }

//     .left,
//     .right {
//         width: 50%;

//         .card {
//             width: 100%;
//         }
//     }

//     .right:not(.message.right) {
//         max-width: 600px;
//     }

//     .left:not(.message.left) {
//         display: flex;
//         flex-direction: column;
//         gap: 15px;
//     }
// }
.task {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;

    h2 {
        font-weight: 600;
        font-size: 42px;
        line-height: 50px;
        letter-spacing: 1px;
    }

    :deep(.card) {
        width: calc(50% - 7.5px);
        height: fit-content;
    }
}

@media (max-width: 1280px) {
    :deep(.content) {
        margin: 20px !important;


        .card {
            width: 100% !important;
        }
    }
}

@media (max-width: 920px) {
    :deep(.card.my-tasks) {
        order: -1;
    }
}
</style>