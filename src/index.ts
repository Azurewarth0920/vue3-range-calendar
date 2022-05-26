import { App, Plugin } from 'vue'
import rangeCalendar from './lib/main'
import '../src/lib/styles/main.scss'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('RangeCalendar', rangeCalendar)
  },
}

export default plugin
