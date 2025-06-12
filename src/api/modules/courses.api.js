import { ENDPOINTS } from "../constants/endpoints";
import client from "../http/client";

export const getCourse = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.COURSES}/${courseId}`)
        return response.data.data
        // return await client.get(`${ENDPOINTS.COURSES}/${courseId}`);
    } catch (error) {
        return [];
    }
};

export const getCourses = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.COURSES}`)
        return response.data.data
    } catch (error) { console.log(error); return [] }
}

export const getCourseActivity = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.COURSES}/${courseId}/activity`);
        return response.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Если активности нет, возвращаем null или пустой объект
            return null;
        }
        console.error('Error fetching course activity:', error);
        return null;
    }
};