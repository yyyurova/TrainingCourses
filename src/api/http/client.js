import axios from 'axios';

const client = axios.create({
    baseURL: 'https://c1a9f09250b13f61.mokky.dev',
    timeout: 10000,
});

// Интерсепторы можно добавить при необходимости
client.interceptors.response.use(
    response => response.data,
    error => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
    }
);

export default client;