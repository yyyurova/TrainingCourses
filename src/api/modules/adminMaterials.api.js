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

export const createQuestion = async (pageId, title, description, is_group = false, attachments) => {
    try {
        const formData = new FormData();
        console.log(pageId, title, description, is_group)
        formData.append('title', title);
        if (description) formData.append('description', description);

        formData.append('is_group', is_group ? '1' : '0');

        console.log('Files to upload:', attachments);
        if (attachments) {
            attachments.forEach(file => {
                formData.append('attachments[]', file);
            });
        }

        const response = await client.post(
            `${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании вопроса:', error);
        throw error;
    }
};

export const deleteQuestion = async (pageId, questionId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}/${questionId}`);
    } catch (error) {
        console.error('Ошибка удаления варианта:', error);
    }
};

export const updateQuestion = async (pageId, questionId, title, description, is_group = false, attachments) => {
    try {
        console.log(pageId, questionId, title, description, is_group = false, attachments)
        const formData = new FormData();

        // Добавляем текстовые поля
        formData.append('title', title);
        if (description) formData.append('description', description);
        if (is_group) formData.append('is_group', is_group);

        // Добавляем файлы (если есть)
        if (attachments && attachments.length > 0) {
            attachments.forEach((file) => {
                formData.append('attachments[]', file);
            });
        }
        formData.get('title')
        const response = await client.post(
            `${ENDPOINTS.ADMIN_MODULE}/page/question/${pageId}/${questionId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении вопроса:', error);
        throw error;
    }
};

export const getVariants = async (questionId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_MODULE}/page/question/variant/${questionId}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return [];
    }
};

export const createVariant = async (questionId, title, is_right) => {
    try {
        const response = await client.post(`${ENDPOINTS.ADMIN_MODULE}/page/question/variant/${questionId}`, { title: title, is_right: is_right });
        return response.data.data;
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

export const deleteVariant = async (questionId, variantId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_MODULE}/page/question/variant/${questionId}/${variantId}`);
    } catch (error) {
        console.error('Ошибка удаления варианта:', error);
    }
};