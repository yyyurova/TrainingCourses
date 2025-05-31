export const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    try {
        return userData ? JSON.parse(userData) : null;
    } catch {
        return null;
    }
};

export const getUserRole = () => {
    const user = getCurrentUser();
    return user?.role || null;
};

export const getUserId = () => {
    const user = getCurrentUser();
    return user?.id || null;
};

export const isCurrentUser = (userId) => {
    return userId === getUserId();
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Дополнительные действия при выходе
};