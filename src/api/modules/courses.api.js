// import client from '../http/client';
// import { ENDPOINTS } from '../constants/endpoints';

import axios from "axios"

// export const getCourses = async (params = { sortBy: '-id' }) => {
//     try {
//         return await client.get(ENDPOINTS.COURSES, { params });
//     } catch (error) {
//         return [];
//     }
// };

export const getCourse = async (courseId) => {
    try {
        const response = await axios.get(`https://api-course.hellishworld.ru/api/courses/${courseId}`)
        return response.data.data
        // return await client.get(`${ENDPOINTS.COURSES}/${courseId}`);
    } catch (error) {
        return [];
    }
};

export const getCourses = async () => {
    try {
        const response = await axios.get(`https://api-course.hellishworld.ru/api/courses`)
        return response.data.data
    } catch (error) { return [] }
}