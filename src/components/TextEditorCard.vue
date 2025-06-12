<template>
    <Card class="no-hover">
        <div ref="editor" class="quill-editor"></div>
    </Card>

    <AddImage @cancel="closeModal" />
    <AddLink @cancel="closeModal" />
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import Card from '@/components/Card.vue';
import AddLink from './modals/AddLink.vue';
import AddImage from './modals/AddImage.vue';

const props = defineProps({
    content: {
        type: String,
        default: ''
    },
    modelValue: {
        type: String,
        default: ''
    }
});

const showAddLinkModal = ref(false)
const showAddImageModal = ref(false)

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
    if (showAddImageModal.value) { showAddImageModal.value = false }
    if (showAddLinkModal.value) { showAddLinkModal.value = false }
}

const openAddLinkModal = () => {
    showAddLinkModal.value = true
}

const openAddImageModal = () => {
    showAddImageModal.value = true
}

const editor = ref(null);
const quill = ref(null);
const isMounted = ref(true);

onUnmounted(() => {
    isMounted.value = false;
});

const initializeIcons = () => {
    const icons = Quill.import('ui/icons');
    icons['bold'] = '<img src="/icons/bold.svg" alt="Ж" class="ql-icon">';
    icons['italic'] = '<img src="/icons/italics.svg" alt="К" class="ql-icon">';
    icons['underline'] = '<img src="/icons/underline.svg" alt="Ч" class="ql-icon">';
    icons['code'] = '<img src="/icons/code.svg" alt="Код" class="ql-icon">';
    icons['list']['bullet'] = '<img src="/icons/ulist.svg" alt="Марк.список" class="ql-icon">';
    icons['list']['ordered'] = '<img src="/icons/olist.svg" alt="Нум.список" class="ql-icon">';
    icons['align'][''] = '<img src="/icons/align-left.svg" alt="По левому краю" class="ql-icon">';
    icons['align']['center'] = '<img src="/icons/align-center.svg" alt="По центру" class="ql-icon">';
    icons['align']['right'] = '<img src="/icons/align-right.svg" alt="По правому краю" class="ql-icon">';
    icons['image'] = '<img src="/icons/paperclip.svg" alt="Вставить изображение" class="ql-icon">';
    icons['link'] = '<img src="/icons/link.svg" alt="Добавить ссылку" class="ql-icon">';
};

function imageHandler() {
    const range = this.quill.getSelection();
    const imageUrl = prompt("Введите URL изображения:");
    if (imageUrl) {
        this.quill.insertEmbed(range.index, 'image', imageUrl, 'user');
    }
}

function linkHandler() {
    const range = this.quill.getSelection();
    const linkUrl = prompt("Введите URL ссылки:");
    if (linkUrl) {
        if (range.length === 0) {
            const linkText = prompt("Введите текст ссылки:");
            this.quill.insertText(range.index, linkText, 'link', linkUrl);
        } else {
            this.quill.format('link', linkUrl);
        }
    }
}

onMounted(() => {
    initializeIcons();

    quill.value = new Quill(editor.value, {
        modules: {
            toolbar: {
                container: [
                    'image',
                    'bold', 'italic', 'underline', 'code', 'link',
                    { 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'align': '' }, { 'align': 'center' }, { 'align': 'right' }
                ],
                handlers: {
                    image: openAddImageModal,
                    link: openAddLinkModal
                }
            }
        },
        theme: 'snow',
        placeholder: 'Введите текст...',
    });

    if (props.modelValue) {
        quill.value.root.innerHTML = props.modelValue;
    } else if (props.content) {
        quill.value.root.innerHTML = props.content;
    }

    quill.value.on('text-change', () => {
        const html = quill.value.root.innerHTML;
        emit('update:modelValue', html === '<p><br></p>' ? '' : html);
    });
});

watch(() => props.modelValue, (newValue) => {
    if (newValue !== quill.value.root.innerHTML) {
        quill.value.root.innerHTML = newValue;
    }
});

watch(() => props.content, (newValue) => {
    if (newValue && newValue !== quill.value.root.innerHTML) {
        quill.value.root.innerHTML = newValue;
    }
});
</script>

<style lang="scss">
.ql-toolbar.ql-snow {
    width: 100%;
    order: 2;
    border: none !important;
    border-top: 1px solid #D9D9D9 !important;
    padding: 10px !important;

    .ql-formats {
        display: flex;
        gap: 7px;
        align-items: center;
        flex-wrap: wrap;
        margin: 0;

        button {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px !important;
            cursor: pointer !important;
            border-radius: 4px !important;

            &:hover {
                background: #E9F2FF !important;
            }

            &.ql-active {
                background-color: #E9F2FF !important;
            }

            .ql-icon {
                width: 22px;
                height: 22px;
            }
        }
    }
}

.ql-container.ql-snow {
    border: none !important;
    font-family: inherit !important;
    font-size: inherit !important;
}

.ql-editor {
    padding: 15px !important;
    // min-height: 200px !important;

    &::before {
        font-style: normal !important;
    }

    ul,
    ol {
        padding-left: 20px !important;
        margin: 0 !important;
    }

    img {
        max-width: 100% !important;
        height: auto !important;
    }

    a {
        color: #0066cc;
        text-decoration: underline;
    }
}
</style>

<style scoped lang="scss">
.card {
    width: 100%;
    padding: 0;
    height: 100%;
    max-height: 400px;
    background-color: #ffffff;

    .quill-editor {
        width: 100%;
        // height: 100%;
        min-height: 70px;
    }
}
</style>