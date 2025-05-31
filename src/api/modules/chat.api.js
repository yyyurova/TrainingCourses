import client from "../http/client"
import { ENDPOINTS } from "../constants/endpoints"

export const getChats = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.CHAT}`)
        return response.data.data
    } catch (error) { return [] }
}

export const getChat = async (chatId) => {
    try {
        const response = await client.get(`${ENDPOINTS.CHAT}/${chatId}`)
        return response.data.data
    } catch (error) { return [] }
}

export const createChat = async (newChat) => {
    try {
        await client.post(`${ENDPOINTS.CHAT}`, newChat)
    } catch (error) { return [] }
}

export const getChatMessages = async (chatId) => {
    try {
        const response = await client.get(`${ENDPOINTS.CHAT}/${chatId}/messages`)
        return response.data.data
    } catch (error) { return [] }
}

export const createMessage = async (chatId, message, attachments) => {
    const formData = new FormData();
    formData.append('message', message);
    console.log(message)
    if (attachments) {
        attachments.forEach(file => {
            formData.append('attachments[]', file);
        });
    }

    try {
        await client.post(`${ENDPOINTS.CHAT}/${chatId}/messages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        throw error;
    }
};

export const deleteChat = async (chatId) => {
    try {
        await client.delete(`${ENDPOINTS.CHAT}/${chatId}`)
    } catch (error) { return [] }
}

export const getChatMembers = async (chatId) => {
    try {
        const response = await client.get(`${ENDPOINTS.CHAT}/${chatId}/users`)
        return response.data.data.data
    } catch (error) { return [] }
}

export const addMembersToChat = async (chatId, userIds) => {
    try {
        console.log(userIds)
        await client.post(`${ENDPOINTS.CHAT}/${chatId}/users`, {
            users: userIds
        });
    } catch (error) {
        console.error('Ошибка добавления участников:', error);
        // throw error;
    }
};

export const deleteMember = async (chatId, userId) => {
    try {
        await client.delete(`${ENDPOINTS.CHAT}/${chatId}/users/${userId}`);
    } catch (error) {
        console.error('Ошибка удаления участника:', error);
    }
};