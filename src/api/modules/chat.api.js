import axios from "axios"

const apiClient = axios.create({
    baseURL: "https://api-course.hellishworld.ru/api/chat",
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getChats = async () => {
    try {
        const response = await apiClient.get(`https://api-course.hellishworld.ru/api/chat`)
        console.log(response.data.data)
        return response.data.data
    } catch (error) { return [] }
}


export const createChat = async (newChat) => {
    try {
        await apiClient.post(`https://api-course.hellishworld.ru/api/chat`, newChat)
    } catch (error) { return [] }
}