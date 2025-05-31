import axios from 'axios';

const client = axios.create({
    baseURL: 'https://api-course.hellishworld.ru/api',
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

// client.interceptors.response.use(
//     response => response.data,
//     error => {
//         console.error('API Error:', error.message);
//         return Promise.reject(error);
//     }
// );

export default client;