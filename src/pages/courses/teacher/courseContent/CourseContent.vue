<template>
    <Layout>
        <h1>Содержание курса</h1>
        <Navbar :elements="navbarItems" />

        <div class="modules" v-if="material && !isLoading">
            <Module v-for="module in material" :key="module.id" :module-index="material.indexOf(module)"
                :module="module" />
        </div>

        <Loading v-if="isLoading" />
    </Layout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { getModules, getModulePage } from '@/api/modules/studentMaterials.api';

import Layout from '@/layouts/Layout.vue';
import Navbar from '@/components/Navbar.vue';
import Loading from '@/components/Loading.vue';
import Module from './components/Module.vue';

const material = ref(null)
const isLoading = ref(false)

const route = useRoute()
const courseId = route.params.courseId

const navbarItems = [
    { name: 'Практиканты', linkTo: `/courses/${courseId}/practicants` },
    { name: 'Задания', linkTo: `/courses/${courseId}/tasks` },
    { name: 'Оценки', linkTo: `/courses/${courseId}/marks` },
    { name: 'Содержание курса', linkTo: `/courses/${courseId}/content` }
];

const fetchMaterial = async () => {
    try {
        isLoading.value = true;

        const modules = await getModules(courseId);

        const modulesWithDetailedPages = await Promise.all(
            modules.map(async module => {
                const pages = module.pages;

                const detailedPages = await Promise.all(
                    pages.map(async page => {
                        const pageDetails = await getModulePage(module.id, page.id);
                        return {
                            ...pageDetails
                        };
                    })
                );

                return {
                    ...module,
                    pages: detailedPages
                };
            })
        );

        material.value = modulesWithDetailedPages;
        (material.value)
    } catch (err) {
        console.error('Ошибка загрузки данных:', err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchMaterial)
</script>

<style scoped>
.modules {
    margin-bottom: 30px;
}
</style>