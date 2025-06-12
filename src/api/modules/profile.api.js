import client from '../http/client';
import { ENDPOINTS } from '../constants/endpoints';

export const editProfile = async (newName, avatarFile) => {
    try {
        const formData = new FormData();
        formData.append('name', newName);

        if (avatarFile) {
            formData.append('image', avatarFile);
        }

        const response = await client.post(`${ENDPOINTS.PROFILE}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при редактировании профиля:', error);
        throw error;
    }
};