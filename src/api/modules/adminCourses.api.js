import client from "../http/client";
import { ENDPOINTS } from "../constants/endpoints";

export const getCourse = async (courseId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`)
        return response.data.data
    } catch (error) {
        return [];
    }
};

export const getCourses = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_COURSE}`)
        return response.data.data
    } catch (error) { console.log(error); return [] }
}

export const deleteCourse = async (courseId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`)
    } catch (error) {
        console.log(error)
        return [];
    }
};

export const editCourse = async (courseId, updatedCourse) => {
    try {
        console.log(updatedCourse)
        const formData = new FormData();

        formData.append('title', updatedCourse.title);

        formData.append('published', updatedCourse.published)

        if (updatedCourse.photo) {
            formData.append('photo', updatedCourse.photo);
        } else {
            formData.append('photo', '');
        }
        console.log(formData)
        const response = await client.post(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании курса:', error);
        throw error;
    }
};

export const pulichCourse = async (courseId, newUser) => {
    try {
        return await client.post(`${ENDPOINTS.ADMIN_COURSE}/${courseId}`, newUser);
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};

export const createCourse = async (newCourse) => {
    try {
        const formData = new FormData();
        formData.append('title', newCourse.title);

        if (newCourse.photo) {
            formData.append('photo', newCourse.photo);
        }
        console.log(formData)
        const response = await client.post(`${ENDPOINTS.ADMIN_COURSE}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка при создании курса:', error);
        throw error;
    }
};