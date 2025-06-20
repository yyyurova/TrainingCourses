import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getPracticants = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.CURATOR_STUDENTS}/${courseId}`);
        return response.data.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};

export const getPracticantTasks = async (courseId, userId) => {
    try {
        const response = await client.get(`${ENDPOINTS.TASK}/user/${userId}/course/${courseId}`);
        return response.data.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};