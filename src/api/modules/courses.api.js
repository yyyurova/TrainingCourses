import axios from "axios"

const apiClient = axios.create({
    baseURL: "https://api-course.hellishworld.ru/api/admin",
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const getCourse = async (courseId) => {
    try {
        const response = await apiClient.get(`https://api-course.hellishworld.ru/api/courses/${courseId}`)
        return response.data.data
        // return await client.get(`${ENDPOINTS.COURSES}/${courseId}`);
    } catch (error) {
        return [];
    }
};

export const getCourses = async () => {
    try {
        const response = await apiClient.get(`https://api-course.hellishworld.ru/api/courses`)
        console.log(response.data.data)
        return response.data.data
    } catch (error) { return [] }
}