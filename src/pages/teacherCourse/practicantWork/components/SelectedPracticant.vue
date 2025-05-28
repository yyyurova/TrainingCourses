<template>
    <div class="selected-practicant">
        <div class="top">
            <img :src="practicant.avatar || '/avatar.png'" alt="">
            <p>{{ practicant.name }}</p>
            <button class="icon" @click="deleteFromSelected">
                <img src="/icons/x.svg" alt="">
            </button>
        </div>
        <!-- 
        <div class="files">
            <Card class="no-hover" v-for="(file, index) in files" :key="index">
                <img src="/icons/file.svg" alt="">
                <div class="file__inner">
                    <a href="#" @click.prevent="downloadFile(file)">{{ decodeUtf8(files[0].fileName) }}</a>
                    <p>{{ format(new Date(), 'short') }} ({{ files[0].bytes }} B)</p>
                </div>
                <button class="icon" @click="removeFile(index)">
                    <img src="/icons/x.svg">
                </button>
            </Card>
        </div> -->
        <div class="files" v-if="files.length > 0">
            <Card class="no-hover">
                <img src="/icons/file.svg" alt="">
                <div class="file__inner">
                    <a href="#">{{ decodeUtf8(files[0].fileName) }}</a>
                    <p>{{ format(new Date(), 'short') }} ({{ files[0].bytes }} B)</p>
                </div>
            </Card>
        </div>

        <div class="links">
            <Card class="no-hover" v-for="(link, index) in links" :key="index">
                <img src="/icons/link.svg">
                <div class="link__inner">
                    <a target="_blank" :href="link">{{ link }}</a>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { format } from '@formkit/tempo';
import { decodeUtf8 } from '@/utils/utils';

import Card from '@/components/Card.vue';

const props = defineProps({
    practicant: Object
})

const emit = defineEmits(['delete'])

const files = ref([])
const links = ref(['google.com'])

const fetchFiles = async () => {
    try {
        const { data } = await axios.get(`https://c1a9f09250b13f61.mokky.dev/uploads`);

        if (Array.isArray(data)) {
            const practicantFiles = data;

            files.value = practicantFiles.length > 0 ? [practicantFiles[0]] : [];
        } else {
            files.value = [];
        }
    } catch (err) {
        console.log(err);
        files.value = [];
    }
}

const deleteFromSelected = () => {
    emit('delete', props.practicant)
}

onMounted(async () => {
    await fetchFiles()
})
</script>

<style scoped lang="scss">
.selected-practicant {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;

    &:not(:last-child) {
        border-bottom: 1px solid #D9D9D9;
    }

    .top {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;

        p {
            flex: 1;
        }

        img {
            width: 35px;
            height: auto;
        }
    }

    .links,
    .files {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .card {
            width: 400px;
            flex-direction: row;
            align-items: center;
            gap: 10px;

            .file__inner,
            .link__inner {
                flex: 1;
            }
        }
    }
}
</style>