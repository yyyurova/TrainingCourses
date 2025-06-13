import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getTasksStatistics = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.PROFILE}/tasks/${courseId}`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const getCourseActivity = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.COURSES}/${courseId}/activity`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching course activity:', error);
        return null;
    }
};

export const getTestsStatistics = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.PROFILE}/tasks/course/${courseId}`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const getActiveDays = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.COURSES}/${courseId}/calendar`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};