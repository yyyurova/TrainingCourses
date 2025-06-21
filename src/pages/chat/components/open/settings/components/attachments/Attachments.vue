<template>
    <div class="attachments" v-if="images && images.length > 0">
        <div class="images-grid">
            <div class="image-card" v-for="(img, index) in images" :key="'img-' + index" @click="showImage(img)">
                <div class="preview-container">
                    <!-- <SVGPreview v-if="img.path.endWith('.svg')" :content="img.svgContent" /> -->
                    <!-- <img v-else :src="img.path" :alt="img.name" class="preview-image"> -->

                    <img :src="img.path" :alt="img.name" class="preview-image">
                </div>
            </div>
        </div>
    </div>

    <div class="no-items" v-else>
        <p>В этом чате нет фотографий</p>
    </div>
    <ImageModal v-if="showImageModal" :image="selectedImage" @close="showImageModal = false" />
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { decodeUtf8 } from '@/utils/utils';

import ImageModal from './modals/ImageModal.vue';
import SVGPreview from './SVGPreview.vue';

const images = inject('images')
console.log(images)
const showImageModal = ref(false);
const selectedImage = ref(null);

const showImage = (image) => {
    showImageModal.value = true;
    selectedImage.value = image;
};
</script>

<style scoped lang="scss">
.attachments {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 10px;
    max-height: 100%;
    overflow-x: auto;

    .images-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .image-card {
        width: calc(33% - 10px);
        padding: 15px;
        cursor: pointer;

        .preview-container {
            width: 100%;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            overflow: hidden;

            .preview-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        }
    }
}

.no-items {
    margin-top: 20px;
}

@media (max-width: 960px) {
    .image-card {
        width: calc(50% - 5px) !important;
    }
}
</style>