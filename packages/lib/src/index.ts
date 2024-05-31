import { App, Plugin } from 'vue'
import type { Options } from './options'
import RangeCalendar from './main'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('RangeCalendar', RangeCalendar)
  },
}

export { RangeCalendar, Options }
export default plugin
