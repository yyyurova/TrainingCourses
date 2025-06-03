import client from "../http/client";
import { ENDPOINTS } from "../constants/endpoints";

export const sendAnswer = async (answers) => {
    try {
        const response = await client.post(`${ENDPOINTS.ANSWERS}`, answers)
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};