import { App, Plugin } from 'vue'
import type { Options } from './options'
import RangeCalendar from './main'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('RangeCalendar', RangeCalendar)
  },
}

const defineOptions = (options: Options) => options

export { RangeCalendar, Options, defineOptions }
export default plugin
