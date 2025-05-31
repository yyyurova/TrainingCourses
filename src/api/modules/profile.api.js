import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const editProfile = async (newName) => {
    try {
        const response = await client.patch(`${ENDPOINTS.PROFILE}`, { name: newName });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
    }
};