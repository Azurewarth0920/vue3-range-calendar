import { App, Plugin } from 'vue'
import RangeCalendar from './main'
import './styles/main.scss'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('RangeCalendar', RangeCalendar)
  },
}

export { RangeCalendar }
export default plugin
