import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getUsers = async (queryParams = {}) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_USERS}`, {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
        return { data: [], meta: {} };
    }
};

export const getUser = async (userId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_USERS}/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        return null;
    }
};

export const deleteUser = async (userId) => {
    try {
        return await client.delete(`${ENDPOINTS.ADMIN_USERS}/${userId}`);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const editUser = async (userId, newUser) => {
    try {
        return await client.patch(`${ENDPOINTS.ADMIN_USERS}/${userId}`, newUser);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const createUser = async (newUser) => {
    try {
        return await client.post(`${ENDPOINTS.ADMIN_USERS}`, newUser);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};
