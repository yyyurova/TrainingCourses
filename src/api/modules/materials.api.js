import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getModules = async (courseId) => {
    try {
        const response = await axios.get(`${ENDPOINTS.COURSES}/${courseId}/modules`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return [];
    }
};

export const getModulePages = async (moduleId) => {
    try {
        const response = await axios.get(`${ENDPOINTS.MODULES}/${moduleId}/pages`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return [];
    }
}

export const getModulePage = async (moduleId, pageId) => {
    try {
        const response = await axios.get(`${ENDPOINTS.MODULES}/${moduleId}/pages/${pageId}`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return [];
    }
}