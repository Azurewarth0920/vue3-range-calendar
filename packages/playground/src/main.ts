import { createApp } from 'vue'
import App from './App.vue'
import Plugin from '../src/index'

const app = createApp(App)
app.use(Plugin)
app.mount('#app')
