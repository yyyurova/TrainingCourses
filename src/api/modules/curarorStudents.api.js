import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getPracticants = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.CURATOR_STUDENTS}`);
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};