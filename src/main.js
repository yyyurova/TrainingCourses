import './assets/main.css'
import './assets/modals.css'
import { createApp } from 'vue'
import { router, initRouter } from './router'
import App from './App.vue'

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App)

initRouter()

app.use(VCalendar, {})
app.use(router)

app.mount('#app').$nextTick(() => {
    localStorage.setItem('user_role', 'student')
});