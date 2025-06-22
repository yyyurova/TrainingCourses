<template>
    <Card class="no-hover">
        <editor-content :editor="editor" class="editor-content" />

        <div v-if="editor" class="toolbar">
            <button @click="addImage" title="Вставить изображение">
                <img src="/icons/actions/paperclip.svg" alt="Вставить изображение" class="icon">
            </button>

            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }"
                title="Жирный">
                <img src="/icons/textEditor/bold.svg" alt="Ж" class="icon">
            </button>

            <button @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }" title="Курсив">
                <img src="/icons/textEditor/italics.svg" alt="К" class="icon">
            </button>

            <button @click="editor.chain().focus().toggleUnderline().run()"
                :class="{ 'is-active': editor.isActive('underline') }" title="Подчеркивание">
                <img src="/icons/textEditor/underline.svg" alt="Ч" class="icon">
            </button>

            <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }"
                title="Код">
                <img src="/icons/textEditor/code.svg" alt="Код" class="icon">
            </button>

            <button @click="toggleLink" :class="{ 'is-active': editor.isActive('link') }" title="Добавить ссылку">
                <img src="/icons/link.svg" alt="Добавить ссылку" class="icon">
            </button>

            <button @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }" title="Маркированный список">
                <img src="/icons/textEditor/ulist.svg" alt="Марк.список" class="icon">
            </button>

            <button @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor.isActive('orderedList') }" title="Нумерованный список">
                <img src="/icons/textEditor/olist.svg" alt="Нум.список" class="icon">
            </button>

            <button @click="editor.chain().focus().setTextAlign('left').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" title="По левому краю">
                <img src="/icons/textEditor/align-left.svg" alt="По левому краю" class="icon">
            </button>

            <button @click="editor.chain().focus().setTextAlign('center').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" title="По центру">
                <img src="/icons/textEditor/align-center.svg" alt="По центру" class="icon">
            </button>

            <button @click="editor.chain().focus().setTextAlign('right').run()"
                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" title="По правому краю">
                <img src="/icons/textEditor/align-right.svg" alt="По правому краю" class="icon">
            </button>
        </div>
    </Card>

    <AddLink v-if="showLinkModal" @insert="insertLink" @cancel="closeModal" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

import AddLink from './modals/AddLink.vue';
import Card from '@/components/Card.vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const editor = ref(null);
const showLinkModal = ref(false);

const closeModal = () => {
    if (showLinkModal.value) { showLinkModal.value = false }
}

const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.includes('image/')) return;

        try {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                editor.value.chain().focus()
                    .setImage({ src: readerEvent.target.result })
                    .run();
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
        }
    };

    input.click();
};

const openLinkModal = () => {
    showLinkModal.value = true;
};

const toggleLink = () => {
    if (editor.value.isActive('link')) {
        removeLink();
    } else {
        openLinkModal();
    }
};

const insertLink = (url) => {
    if (!url) return;

    if (!/^(https?|ftp|mailto):\/\//i.test(url)) {
        if (url.includes('@') && !url.startsWith('mailto:')) {
            url = 'mailto:' + url;
        }
        else {
            url = 'https://' + url;
        }
    }

    editor.value.chain().focus()
        .setLink({ href: url })
        .run();

    closeModal();
};

const removeLink = () => {
    editor.value.chain().focus()
        .unsetLink()
        .run();
    closeModal()
};

onMounted(() => {
    editor.value = new Editor({
        content: props.modelValue,
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            Link.configure({
                openOnClick: true,
                protocols: ['ftp', 'mailto'],
                HTMLAttributes: {
                    class: 'text-link',
                },
            }),
        ],
        onUpdate: () => {
            const html = editor.value.getHTML();
            emit('update:modelValue', html);
        },
    });
});

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy();
    }
});

watch(() => props.modelValue, (newValue) => {
    if (!editor.value) return;

    const isSame = editor.value.getHTML() === newValue;
    if (isSame) return;

    editor.value.commands.setContent(newValue, false);
});
</script>

<style lang="scss" scoped>
.card {
    width: 100%;
    padding: 0;
    background-color: #fff;

    * {
        outline: none;
        box-shadow: none !important;

        &:focus {
            border: none;
            box-shadow: none !important;
        }
    }

    .toolbar {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        padding: 7px;
        border-top: 1px solid #D9D9D9;

        button {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: background 0.2s;

            &:hover {
                background: #E9F2FF
            }

            &.is-active {
                background: #E9F2FF
            }

            .icon {
                width: 20px;
                height: 20px;
            }
        }
    }

    .editor-content {
        padding: 16px;
        min-height: 70px !important;
        width: 100%;
        border: none !important;

        :deep(a.text-link) {
            color: #2563eb !important;
            text-decoration: underline;
            cursor: pointer;

            * {
                color: #2563eb !important;
                text-decoration: underline;
            }

            &:hover {
                color: #1d4ed8 !important;
            }
        }

        :deep(.ProseMirror) {
            * {
                word-break: break-all;
            }

            &:focus {
                outline: none !important;
                border: none !important;
                box-shadow: none !important;
            }

            >*+* {
                margin-top: 0.75em;
            }

            ul,
            ol {
                margin: 0;
            }

            img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
            }
        }
    }
}
</style>