// import client from '../http/client';
// import { ENDPOINTS } from '../constants/endpoints';

import axios from "axios";

export const login = async (email, password) => {
    try {
        return await axios.post(`https://api-course.hellishworld.ru/api/login`, {
            email: email,
            password: password
        });
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
};


export const register = async (name, email, password) => {
    try {
        return await axios.post(`https://api-course.hellishworld.ru/api/register`, {
            name: name,
            email: email,
            password: password,
        });
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
};