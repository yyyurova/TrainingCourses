<template>
    <Card class="no-hover">
        <div ref="editor" class="quill-editor"></div>
    </Card>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Card from '@/components/Card.vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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

const LinkBlot = Quill.import('formats/link');
class CustomLink extends LinkBlot {
    static create(value) {
        const node = super.create(value);
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
        return node;
    }
}
Quill.register(CustomLink, true);

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

const emit = defineEmits(['update:modelValue']);

const editor = ref(null);
const quill = ref(null);

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
                    image: imageHandler,
                    link: linkHandler
                }
            },
            clipboard: {
                matchVisual: false
            }
        },
        theme: 'snow',
        placeholder: 'Введите текст...',
        formats: ['bold', 'italic', 'underline', 'code', 'list', 'align', 'link', 'image']
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

const imageHandler = () => {
    if (!isMounted.value) return Promise.resolve();
    return new Promise((resolve) => {
        if (!quill.value) return resolve();

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            try {
                let range = quill.value.getSelection(true);

                if (!range) {
                    range = { index: quill.value.getLength(), length: 0 };
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    if (quill.value) {
                        quill.value.insertEmbed(range.index, 'image', e.target.result, Quill.sources.USER);
                        quill.value.setSelection(range.index + 1, 0);
                    }
                    resolve();
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Ошибка при вставке изображения:', error);
                resolve();
            }
        };
    });
};

const linkHandler = () => {
    if (!isMounted.value) return;
    if (!quill.value) return;

    let range = quill.value.getSelection();

    if (!range) {
        range = { index: quill.value.getLength(), length: 0 };
    }

    if (range.length > 0) {
        const text = quill.value.getText(range.index, range.length);
        const preview = text.length > 20 ? text.substring(0, 20) + '...' : text;
        const currentLink = quill.value.getFormat(range.index, range.length).link;

        let url = prompt('Введите URL для ссылки:', currentLink || 'https://');
        if (!url) return;

        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        quill.value.formatText(range.index, range.length, 'link', url);
    } else {
        const url = prompt('Введите URL для ссылки:', 'https://');
        if (!url) return;

        const text = prompt('Введите текст ссылки:', url);
        if (!text) return;

        const normalizedUrl = /^https?:\/\//i.test(url) ? url : 'https://' + url;
        const index = range.index;

        quill.value.insertText(index, text, 'link', normalizedUrl);
        quill.value.setSelection(index + text.length, 0);
    }
};

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
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;

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
    min-height: 200px !important;

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

    .quill-editor {
        width: 100%;
        height: 100%;
        min-height: 200px;
    }
}
</style>