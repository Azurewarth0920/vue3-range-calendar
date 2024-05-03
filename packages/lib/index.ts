import { App, Plugin } from 'vue'
import rangeCalendar from './src/main'
import './src/styles/main.scss'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('RangeCalendar', rangeCalendar)
  },
}

export default plugin
