<template>
    <div class="attachments">
        <div class="images-grid">
            <div class="image-card" v-for="(img, index) in images" :key="'img-' + index" @click="showImage(img)">
                <div class="preview-container">
                    <SVGPreview v-if="img.type === 'svg'" :content="img.svgContent" />
                    <img v-else :src="img.url" :alt="decodeUtf8(img.fileName)" class="preview-image">
                </div>
            </div>
        </div>
    </div>
    <ImageModal v-if="showImageModal" :image="selectedImage" @close="showImageModal = false" />
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { decodeUtf8 } from '@/utils/utils';

import ImageModal from './modals/ImageModal.vue';
import SVGPreview from './SVGPreview.vue';

const images = ref([]);
const showImageModal = ref(false);
const selectedImage = ref(null);
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

const fetchImages = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/uploads`);

        const imagePromises = data.filter(file => {
            const extension = file.fileName.split('.').pop().toLowerCase();
            return imageExtensions.includes(extension);
        }).map(async (file) => {
            const extension = file.fileName.split('.').pop().toLowerCase();

            if (extension === 'svg') {
                try {
                    const response = await axios.get(file.url, { responseType: 'text' });
                    let svgContent = response.data;

                    // Удаляем атрибуты width/height и добавляем viewBox если его нет
                    svgContent = svgContent.replace(/(width|height)="[^"]*"/g, '');
                    if (!svgContent.includes('viewBox') && svgContent.includes('<svg')) {
                        const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
                        if (!viewBoxMatch) {
                            svgContent = svgContent.replace('<svg', '<svg viewBox="0 0 100 100"');
                        }
                    }

                    return {
                        ...file,
                        type: 'svg',
                        svgContent: svgContent
                    };
                } catch (err) {
                    console.error('Ошибка загрузки SVG:', file.url, err);
                    return null;
                }
            } else {
                return {
                    ...file,
                    type: 'img'
                };
            }
        });

        const loadedImages = (await Promise.all(imagePromises)).filter(img => img !== null);
        images.value = loadedImages;

    } catch (err) {
        console.error('Ошибка получения файлов:', err);
    }
};

const showImage = (image) => {
    showImageModal.value = true;
    selectedImage.value = image;
};

onMounted(async () => {
    fetchImages();
});
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
        width: 200px;
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
</style>