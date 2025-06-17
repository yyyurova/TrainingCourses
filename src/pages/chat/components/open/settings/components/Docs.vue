<template>
    <div class="docs" v-if="docs">
        <a :href="doc.path" v-for="(doc, index) in docs" :key="index">
            <Card class="no-hover">
                <img src="/icons/file.svg" alt="">
                <div class="info">
                    <p class="file-name">{{ doc.name }}</p>
                    <p class="file-size">{{ formatFileSize(doc.size) }}</p>
                </div>
            </Card>
        </a>
    </div>
    <div class="no-items" v-else>
        <p>В этом чате нет документов</p>
    </div>
</template>

<script setup>
import { inject } from 'vue';

import Card from '@/components/Card.vue';

const docs = inject('docs')

const formatFileSize = (sizeInMB) => {
    const sizeInKB = sizeInMB * 1024;
    if (sizeInMB < 0.1) {
        return `${sizeInKB.toFixed(2)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
};
</script>

<style scoped lang="scss">
.docs {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    // padding-bottom: 10px;
    max-height: 100%;
    overflow-x: auto;


    a {
        text-decoration: none;
        width: calc(50% - 5px);

        .card {
            width: 100%;
            flex-direction: row;
            align-items: center;
            padding: 20px 15px;
            gap: 6px;

            .info {
                max-width: 85%;

                .file-size {
                    font-size: 12px;
                    color: #7D7D7D;
                }

                .file-name {
                    font-weight: 500;
                    color: #292929;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }
            }
        }
    }
}

.no-items {
    margin-top: 20px;
}

@media (max-width: 930px) {
    .docs {
        display: flex;
        flex-wrap: wrap;
    }

    .card {
        width: 49% !important;
    }
}

@media (max-width: 768px) {
    .card {
        width: 100% !important;
    }
}
</style>