import './assets/main.css'
import './assets/modals.css'
// import 'normalize.css';
import { createApp } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
// import { createRouter, createWebHistory } from 'vue-router'
import { router } from './router'
import App from './App.vue'

// Import pages
// import Admin_users from './pages/Admin_users.vue'
// import Admin_courses from './pages/Admin_courses.vue'

const app = createApp(App)

// const routes = [
//     { path: '/', name: 'Admin_users', component: Admin_users },
//     { path: '/courses', name: 'Admin_courses', component: Admin_courses },
//     // { path: '/orders', name: 'Orders', component: Orders },
// ]

// const router = createRouter({
//     history: createWebHistory(),
//     routes
// })

app.use(autoAnimatePlugin)
app.use(router)
app.mount('#app')