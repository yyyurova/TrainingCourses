import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const getUsers = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_USERS}`);
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
        await client.delete(`${ENDPOINTS.ADMIN_USERS}/${userId}`);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const editUser = async (userId, newUser) => {
    try {
        await client.patch(`${ENDPOINTS.ADMIN_USERS}/${userId}`, newUser);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const createUser = async (newUser) => {
    try {
        await client.post(`${ENDPOINTS.ADMIN_USERS}`, newUser);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};
