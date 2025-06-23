# Training Courses Service - Frontend

Frontend часть сервиса учебных курсов, разработанная на Vue.js 3.

## Технологии

- Vue.js 3
- Vue Router
- Axios (для HTTP-запросов)
- Tiptap для создания редактора текста
- SCSS для удобного написания стилей
- VCalendar для создани календаря
- Pluralize для удобного преобразования форм слов

## Установка и запуск

### 1. Установка зависимостей

```sh
npm install
# или
yarn install
# или
pnpm install
```

### 2. Настройка переменных окружения

Создайте файл .env в корне проекта на основе примера из env.example
Заполните необходимые переменные окружения в .env файле.

### 3. Запуск dev-сервера с hot-reload (режим разработки):

```sh
npm run dev
# или
yarn dev
# или
pnpm dev
```

### 4. Сборка для production

Для сборки проекта выполните:

```sh
npm run build
# или
yarn build
# или
pnpm build
```

Собранные файлы будут помещены в директорию dist/.
