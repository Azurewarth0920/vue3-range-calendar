import { createApp } from 'vue'
import App from './App.vue'
import Plugin from '../src/index'
import '../src/lib/styles/main.scss'

const app = createApp(App)
app.use(Plugin)
app.mount('#app')
