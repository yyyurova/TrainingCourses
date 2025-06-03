import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getModules = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_MODULE}/${courseId}`);
        return response.data.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const createModule = async (courseId, title) => {
    try {
        const response = await client.post(`${ENDPOINTS.ADMIN_MODULE}/${courseId}`, { title: title });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const updateModule = async (courseId, moduleId, title) => {
    try {
        const response = await client.patch(`${ENDPOINTS.ADMIN_MODULE}/${courseId}/${moduleId}`, { title: title });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const deleteModule = async (courseId, moduleId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_MODULE}/${courseId}/${moduleId}`);
    } catch (error) {
        console.error('Ошибка удаления модуля:', error);
    }
};

export const getPagesForModule = async (moduleId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_MODULE}/page/${moduleId}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки страниц:', error);
        return [];
    }
};

export const createPage = async (moduleId, title, type) => {
    try {
        const response = await client.post(`${ENDPOINTS.ADMIN_MODULE}/page/${moduleId}`, { title: title, type: type });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const updatePage = async (moduleId, pageId, title, type) => {
    try {
        const response = await client.patch(`${ENDPOINTS.ADMIN_MODULE}/page/${moduleId}/${pageId}`, { title: title, type: type });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const deletePage = async (moduleId, pageId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_MODULE}/page/${moduleId}/${pageId}`);
    } catch (error) {
        console.error('Ошибка удаления страницы:', error);
    }
};

export const getQuestionsForPage = async (pageId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return [];
    }
};

export const getQuestion = async (pageId, questionId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}/${questionId}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return [];
    }
};

export const createQuestion = async (pageId, title, description) => {
    try {
        const response = await client.post(`${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}`, { title: title, description: description });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const updateQuestion = async (pageId, questionId, title, description) => {
    try {
        const response = await client.patch(`${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}/${questionId}`, { title: title, description: description });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const createVariant = async (questionId, title, is_right) => {
    try {
        const response = await client.post(`${ENDPOINTS.ADMIN_MODULE}/page/question/variant/${questionId}`, { title: title, is_right: is_right });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const updateVariant = async (questionId, variantId, title, is_right) => {
    try {
        const response = await client.patch(`${ENDPOINTS.ADMIN_MODULE}/page/question/variant/${questionId}/${variantId}`, { title: title, is_right: is_right });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};