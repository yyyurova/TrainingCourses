import { ENDPOINTS } from "../constants/endpoints";
import client from "../http/client";

export const getClassrooms = async () => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_CLASS}`);
        const classrooms = response.data.data;

        // Загружаем участников для каждого класса параллельно
        const classroomsWithMembers = await Promise.all(
            classrooms.map(async classroom => {
                const members = await getClassroomMembers(classroom.id);
                return {
                    ...classroom,
                    members
                };
            })
        );

        return classroomsWithMembers;
    } catch (error) {
        console.error('Ошибка загрузки классов:', error);
        return [];
    }
};

export const createClassroom = async (classroomData) => {
    try {
        const response = await client.post(`${ENDPOINTS.ADMIN_CLASS}`, {
            title: classroomData.title,
            course_id: classroomData.course_id
        });
        return response.data.data;
    } catch (error) {
        console.error('Ошибка создания класса:', error);
        throw error;
    }
};

export const deleteClass = async (classroomId) => {
    try {
        await client.delete(`${ENDPOINTS.ADMIN_CLASS}/${classroomId}`);
    } catch (error) {
        console.error('Ошибка удаления класса:', error);
        throw error;
    }
};

export const addCuratorToClass = async (classroomId, curatorId) => {
    try {
        await client.post(`${ENDPOINTS.ADMIN_CLASS}/${classroomId}/curator`, {
            user_id: curatorId
        });
    } catch (error) {
        console.error('Ошибка добавления куратора:', error);
        throw error;
    }
};

export const addUsersToClass = async (classroomId, users) => {
    try {
        await client.post(`${ENDPOINTS.ADMIN_CLASS}/${classroomId}/users`, {
            user_ids: users.map(user => user.id)
        });
    } catch (error) {
        console.error('Ошибка добавления пользователей:', error);
        throw error;
    }
};

export const getClassroomMembers = async (classroomId) => {
    try {
        const response = await client.get(`${ENDPOINTS.ADMIN_CLASS}/${classroomId}/users`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка загрузки участников класса:', error);
        return [];
    }
};

export const editClass = async (classId, newClass) => {
    try {
        await client.patch(`${ENDPOINTS.ADMIN_CLASS}/${classId}`, newClass);
        // return response.data.data
    } catch (error) {
        console.error('Ошибка :', error);
        return null;
    }
};