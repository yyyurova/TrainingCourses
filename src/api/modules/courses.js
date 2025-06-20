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