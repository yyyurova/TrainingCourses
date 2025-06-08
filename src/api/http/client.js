import axios from 'axios';

const client = axios.create({
    baseURL: 'https://api-course.hellishworld.ru/api',
    headers: {
        Accept: "application/json"
    }
});

// Добавляем интерцептор запросов для динамического обновления токена
client.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;