import { createApp } from 'vue'
import App from './App.vue'
import Plugin from '@vue3-range-calendar/lib'

const app = createApp(App)
app.use(Plugin)
app.mount('#app')
