import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getChats = async (params = { sortBy: '-date' }) => {
    try {
        return await client.get(ENDPOINTS.CHATS, { params });
    } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
        return [];
    }
};