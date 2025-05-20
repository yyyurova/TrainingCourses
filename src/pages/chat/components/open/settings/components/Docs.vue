<template>
    <div class="docs">
        <Card class="no-hover" v-for="(doc, index) in docs" :key="index">
            <img src="/icons/file.svg" alt="">
            <div class="info">
                <p class="file-name">{{ decodeUtf8(doc.fileName) }}</p>
                <p class="file-size">{{ doc.bytes }} bytes</p>
            </div>
        </Card>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { decodeUtf8 } from '@/utils/utils';

import Card from '@/components/Card.vue';

const docs = ref([])

const fetchDocs = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/uploads`)
        docs.value = data
    } catch (err) {
        console.log(err)
    }

}

onMounted(fetchDocs)
</script>

<style scoped lang="scss">
.docs {
    display: grid;
    // grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    width: 100%;
    // display: flex;
    // flex-wrap: wrap;
    gap: 10px;
    // padding-bottom: 10px;
    max-height: 100%;
    overflow-x: auto;


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