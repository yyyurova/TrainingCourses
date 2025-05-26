// roles: admin, teacher, student

export const mockUser = {
    id: 32,
    name: "Иван Иванов",
    role: "admin",
    avatar: "/avatar.png",
    notifications: 3,
    chat: 4,
    tasks: 2,
    tests: {
        all: 99,
        pass: 4,
        averageMark: 7
    },
    activeDays: [
        new Date(2025, 3, 26),
        new Date(2025, 2, 12),
        new Date(2025, 4, 1),
        new Date(2025, 5, 12)
    ]
};