import client from "../http/client";
import { ENDPOINTS } from "../constants/endpoints";

export const getCourses = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.CURATOR_COURSES}`)
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};