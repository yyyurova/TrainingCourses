<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal__inner">
                <h2>Вставить ссылку</h2>
                <div class="form-group">
                    <label>Адрес ссылки</label>
                    <input type="url" autocomplete="off" required placeholder="https://example.com">
                </div>
                <div class="form-group">
                    <label>Текст ссылки</label>
                    <input type="text" autocomplete="off" required placeholder="Текст ссылки">
                </div>
                <div class="modal-buttons">
                    <button type="button" class="transparent">Отмена</button>
                    <button type="button" class="blue">Вставить</button>
                </div>
            </div>
        </div>
    </div>
</template>