<template>
    <div class="selected-practicant">
        <div class="top">
            <img v-if="practicant.avatar" :src="practicant.avatar" alt="">
            <AvatarLetter v-else :name="practicant.name" />
            <p>{{ practicant.name }}</p>
            <button class="icon" @click="deleteFromSelected">
                <img src="/icons/x.svg" alt="">
            </button>
        </div>

        <div class="files" v-if="files.length > 0">
            <Card v-for="file in files" :key="file.id" class="no-hover">
                <img src="/icons/file.svg" alt="">
                <div class="file__inner">
                    <a :href="file.url">{{ file.name }}</a>
                    <p>{{ format(file.created_at, { date: 'short', time: 'short' }) }} ({{ formatFileSize(file.size) }})
                    </p>
                </div>
            </Card>
        </div>

        <div class="links" v-if="links.length > 0">
            <Card class="no-hover" v-for="link in links" :key="link.id">
                <img src="/icons/link.svg">
                <div class="link__inner">
                    <a target="_blank" :href="link.url">{{ link.url }}</a>
                    <p>{{ format(link.created_at, { date: 'short', time: 'short' }) }} </p>
                </div>
            </Card>
        </div>
        <div class="no-items" v-if="links.length === 0 && files.length === 0">
            <p>Этот практикант пока ничего не присылал</p>
        </div>
    </div>
</template>

<script setup>
import { format } from '@formkit/tempo';

import Card from '@/components/Card.vue';
import AvatarLetter from '@/components/AvatarLetter.vue';

const props = defineProps({
    practicant: Object
})
const emit = defineEmits(['delete'])

const files = props.practicant.files.filter(f => f.type !== 'link')
const links = props.practicant.files.filter(f => f.type === 'link')

const formatFileSize = (sizeInMB) => {
    const sizeInKB = sizeInMB * 1024; // Переводим МБ в КБ
    if (sizeInMB < 0.1) {
        return `${sizeInKB.toFixed(2)} KB`; // Показываем с 2 знаками после запятой для КБ
    }
    return `${sizeInMB.toFixed(2)} MB`; // Показываем с 2 знаками после запятой для МБ
};

const deleteFromSelected = () => {
    emit('delete', props.practicant)
}
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
            width: 100%;
            max-width: 100%;
            flex-direction: row;
            align-items: center;
            gap: 10px;

            .file__inner,
            .link__inner {
                flex: 1;

                * {
                    word-break: break-all;
                }

                p {
                    margin-top: 5px;
                    color: #787878;
                }
            }
        }
    }
}
</style>