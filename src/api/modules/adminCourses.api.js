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
        const response = await apiClient.get(`course/${courseId}`)
        return response.data.data
        // return await client.get(`${ENDPOINTS.COURSES}/${courseId}`);
    } catch (error) {
        return [];
    }
};

export const getCourses = async () => {
    try {
        const response = await apiClient.get(`/course`)
        return response.data.data
    } catch (error) { return [] }
}

export const deleteCourse = async (courseId) => {
    try {
        await apiClient.delete(`course/${courseId}`)
    } catch (error) {
        return [];
    }
};

export const editCourse = async (courseId, newUser) => {
    try {
        await apiClient.patch(`/course/${courseId}`, newUser);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const createCourse = async (newCourse) => {
    try {
        return await apiClient.post(`/course`, newCourse);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};