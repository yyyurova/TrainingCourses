import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const login = async (email, password) => {
    try {
        return await client.post(`${ENDPOINTS.LOGIN}`, { email, password });
    } catch (error) {
        return { error }; // Возвращаем объект ошибки вместо throw
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