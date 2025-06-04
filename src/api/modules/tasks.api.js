import { ENDPOINTS } from "../constants/endpoints";
import client from "../http/client";

export const getTasks = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.TASK}`)
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};

export const getTask = async (taskId) => {
    try {
        const response = await client.get(`${ENDPOINTS.TASK}/${taskId}`)
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};

export const createTask = async (newTask) => {
    try {
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }

        const response = await client.post(`${ENDPOINTS.TASK}`, {
            name: newTask.name,
            text: newTask.text || 'Text',
            until: formatDate(newTask.until),
            published: newTask.published,
            attachments: newTask.attachments,
            users: newTask.users
        })
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await client.delete(`${ENDPOINTS.TASK}/${taskId}`)
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};

export const updateTask = async (taskId, newTask) => {
    try {
        const response = await client.post(`${ENDPOINTS.TASK}/${taskId}`, {
            name: newTask.name,
            text: newTask.text,
            until: newTask.until
        })
        return response.data.data
    } catch (error) {
        console.log(error)
        return [];
    }
};