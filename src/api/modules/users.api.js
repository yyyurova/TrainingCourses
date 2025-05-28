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
        console.log(localStorage.getItem('token'))
        const response = await apiClient.get("/users", { params });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
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
        await axios.delete(`https://api-course.hellishworld.ru/api/admin/users/${userId}`);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};


export const editUser = async (userId) => {
    try {
        await axios.put(`https://api-course.hellishworld.ru/api/admin/users/${userId}`);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};