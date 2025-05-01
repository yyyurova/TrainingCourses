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
        default:
            translated = '- '
    }

    return translated
}

export function translateStatus(status) {
    let translated;

    switch (status.toLowerCase()) {
        case 'new user':
            translated = 'Новый пользователь'
            break
        case 'approved':
            translated = 'Доступ одобрен'
            break
        case 'disapproved':
            translated = 'Доступ не одобрен'
            break
        default:
            translated = '-'
    }

    return translated
}