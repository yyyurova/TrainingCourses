import './assets/main.scss'
import './assets/modals.scss'
import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App)

app.use(VCalendar, {})
app.use(router)

app.mount('#app')