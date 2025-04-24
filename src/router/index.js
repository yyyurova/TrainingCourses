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