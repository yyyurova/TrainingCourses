import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getUsers = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.USERS}`);
        return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};