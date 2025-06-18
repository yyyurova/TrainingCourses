import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const login = async (email, password) => {
    try {
        return await client.post(`${ENDPOINTS.LOGIN}`, { email, password });
    } catch (error) {
        console.log(error)
        return { error };
    }
};

export const register = async (name, email, password) => {
    try {
        return await client.post(`${ENDPOINTS.REGISTER}`, {
            name: name,
            email: email,
            password: password,
        });
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
};

export const getLoginUrls = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.LOGIN}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching auth URLs:', error);
        throw error;
    }
};