import client from "../http/client";
import { ENDPOINTS } from "../constants/endpoints";

export const getCourse = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`)
        return response.data.data
        // return await client.get(`${ENDPOINTS.COURSES}/${courseId}`);
    } catch (error) {
        return [];
    }
};

export const getCourses = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_COURSE}`)
        return response.data.data
    } catch (error) { return [] }
}

export const deleteCourse = async (courseId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`)
    } catch (error) {
        return [];
    }
};

export const editCourse = async (courseId, newUser) => {
    try {
        await client.patch(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`, newUser);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const createCourse = async (newCourse) => {
    try {
        return await client.post(`${ENDPOINTS.ADMIN_COURSE}`, newCourse);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};