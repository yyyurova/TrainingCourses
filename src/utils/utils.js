export function translateRole(role) {
    let translated;

    switch (role.toLowerCase()) {
        case 'admin':
            translated = 'Администратор'
            break
        case 'user':
            translated = 'Студент'
            break
        case 'curator':
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
        case 'pending':
            translated = 'Новый пользователь'
            break
        case 'approved':
            translated = 'Доступ одобрен'
            break
        case 'rejected':
            translated = 'Доступ не одобрен'
            break
        default:
            translated = '-'
    }

    return translated
}

export const checkOverdueDeadline = (dateString) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const now = new Date();
    return deadline < now;
};

export function decodeUtf8(encoded) {
    const bytes = new Uint8Array(encoded.split('').map(c => c.charCodeAt(0)));
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}