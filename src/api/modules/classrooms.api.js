import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getClassrooms = async (params = { sortBy: '-id' }) => {
    try {
        return await client.get(ENDPOINTS.CLASSROOMS, { params });
    } catch (error) {
        return [];
    }
};