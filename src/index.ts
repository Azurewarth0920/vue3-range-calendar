import { App, Plugin } from 'vue'
import VueDateRangePicker from './lib/main'
import '../src/lib/styles/main.scss'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('RangeCalendar', VueDateRangePicker)
  },
}

export default plugin
