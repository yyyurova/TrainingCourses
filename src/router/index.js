import { createRouter, createWebHistory } from "vue-router";
import { adminRoutes } from "./adminRoutes";
import { coursesRoutes } from "./coursesRoutes";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...adminRoutes,
        ...coursesRoutes
    ]
})

router.afterEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'Training Courses' // Укажите заголовок по умолчанию
    }
})

// export default router