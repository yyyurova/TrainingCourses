<template>
    <Card class="no-hover text">
        <div class="editor-content" v-html="content" contenteditable="true" @input="handleInput"
            @mouseup="updateSelection" @keyup="updateSelection"></div>
        <div class="text-settings">
            <div class="format-toolbar">
                <input type="file" ref="fileInput" hidden @change="handleFileUpload">

                <button class="icon tool-button" @click.prevent="$refs.fileInput.click()">
                    <img src="/icons/paperclip.svg" alt="Attach">
                </button>
                <button class="icon tool-button" :class="{ 'active': isBold }" @click.prevent="handleFormat('bold')">
                    <img src="/icons/bold.svg" alt="B">
                </button>
                <button class="icon tool-button" :class="{ 'active': isItalic }"
                    @click.prevent="handleFormat('italic')">
                    <img src="/icons/italics.svg" alt="I">
                </button>
                <button class="icon tool-button" :class="{ 'active': isUnderline }"
                    @click.prevent="handleFormat('underline')">
                    <img src="/icons/underline.svg" alt="U">
                </button>
                <button class="icon tool-button" :class="{ 'active': isCode }" @click.prevent="handleFormat('code')">
                    <img src="/icons/code.svg" alt="Code">
                </button>
                <button class="icon tool-button" :class="{ 'active': isUnorderedList }"
                    @click.prevent="handleFormat('insertUnorderedList')">
                    <img src="/icons/ulist.svg" alt="UL">
                </button>
                <button class="icon tool-button" :class="{ 'active': isOrderedList }"
                    @click.prevent="handleFormat('insertOrderedList')">
                    <img src="/icons/olist.svg" alt="OL">
                </button>
                <button class="icon tool-button" @click.prevent="handleFormat('justifyLeft')"
                    :class="{ 'active': isAlignLeft }">
                    <img src="/icons/align-left.svg" alt="Left">
                </button>
                <button class="icon tool-button" @click.prevent="handleFormat('justifyCenter')"
                    :class="{ 'active': isAlignCenter }">
                    <img src="/icons/align-center.svg" alt="Center">
                </button>
                <button class="icon tool-button" @click.prevent="handleFormat('justifyRight')"
                    :class="{ 'active': isAlignRight }">
                    <img src="/icons/align-right.svg" alt="Right">
                </button>
            </div>
        </div>
    </Card>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import Card from '@/components/Card.vue';

const props = defineProps({
    content: {
        type: String,
        reqiured: false
    }
})
console.log(props.content)
const emit = defineEmits(['update:modelValue']);
const fileInput = ref(null);

const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const isCode = ref(false);
const isUnorderedList = ref(false);
const isOrderedList = ref(false);
const isAlignLeft = ref(false);
const isAlignCenter = ref(false);
const isAlignRight = ref(false);

const handleFormat = (command, value = null) => {
    const editor = document.querySelector('.editor-content');
    editor.focus();

    if (command === 'code') {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            const codeElement = document.createElement('code');
            try {
                range.surroundContents(codeElement);
            } catch (e) {
                console.error('Невозможно применить форматирование кода');
            }
        }
    } else {
        document.execCommand(command, false, value);
    }

    nextTick(() => {
        updateSelection();
    });
};

const updateSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    isBold.value = document.queryCommandState('bold');
    isItalic.value = document.queryCommandState('italic');
    isUnderline.value = document.queryCommandState('underline');
    isUnorderedList.value = document.queryCommandState('insertUnorderedList');
    isOrderedList.value = document.queryCommandState('insertOrderedList');
    isCode.value = checkCodeFormat();

    isAlignLeft.value = document.queryCommandState('justifyLeft');
    isAlignCenter.value = document.queryCommandState('justifyCenter');
    isAlignRight.value = document.queryCommandState('justifyRight');
};

const checkCodeFormat = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;

    while (node !== null) {
        if (node.nodeName === 'CODE' || node.nodeName === 'PRE') {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};

const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            document.execCommand('insertHTML', false, img.outerHTML);
        };
        reader.readAsDataURL(file);
    }
};

const handleInput = (e) => {
    emit('update:modelValue', e.target.innerHTML);
};
</script>

<style scoped lang="scss">
.card.text {
    width: 100%;
    padding: 0;
    height: 100%;
    max-height: 500px;

    .editor-content {
        width: 100%;
        min-height: 200px;
        padding: 15px;
        border-radius: 4px;
        outline: none;
        max-height: 500px;
        overflow-y: auto;

        &:focus {
            border-color: #513DEB;
        }

        ul,
        ol {
            padding-left: 20px;
            margin: 0 !important;
        }
    }

    .text-settings {
        width: 100%;
        border-top: 1px solid #D9D9D9;
        padding: 10px;

        .format-toolbar {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            padding: 8px 16px;

            .tool-button {
                background: none;
                border: none;
                padding: 4px;
                cursor: pointer;
                border-radius: 4px;

                &:hover {
                    background: #E9F2FF;
                }

                &.active {
                    background-color: #E9F2FF;
                }

                img {
                    width: 20px;
                    height: 20px;
                }
            }

            .divider {
                width: 1px;
                height: 24px;
                background: #D9D9D9;
                margin: 0 8px;
            }
        }
    }
}
</style>