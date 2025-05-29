// import client from '../http/client';
// import { ENDPOINTS } from '../constants/endpoints';

import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://api-course.hellishworld.ru/api/admin",
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getUsers = async (params = {}) => {
    try {
        const response = await apiClient.get("/users", { params });
        return response.data;
    } catch (error) {
        console.error('Полная ошибка:', error);
        if (error.response) {
            console.error('Данные ошибки:', error.response.data);
            console.error('Статус:', error.response.status);
            console.error('Заголовки:', error.response.headers);
        }
        return { data: [], meta: {} };
    }
};

export const getUser = async (userId) => {
    try {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        return null;
    }
};

export const deleteUser = async (userId) => {
    try {
        await apiClient.delete(`https://api-course.hellishworld.ru/api/admin/users/${userId}`);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const editUser = async (userId, newUser) => {
    try {
        await apiClient.patch(`/users/${userId}`, newUser);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const createUser = async (newUser) => {
    try {
        await apiClient.post(`/users`, newUser);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};
