export function translateRole(role) {
    let translated;

    switch (role.toLowerCase()) {
        case 'admin':
            translated = 'Администратор'
            break
        case 'student':
            translated = 'Студент'
            break
        case 'teacher':
            translated = 'Куратор'
            break
    }

    return translated
}