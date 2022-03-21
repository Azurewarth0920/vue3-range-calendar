import { computed, defineComponent, PropType, toRef } from 'vue'
import { Options } from '../options'
import CalendarCell from './CalendarCell'
import * as cells from '../cells'
import { deserializeDate } from '../utils/normalizedDate'

export default defineComponent({
  props: {
    date: {
      type: Number,
      required: true,
    },
    type: {
      type: String as PropType<Options['type']>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div>
        {props.type === 'date' &&
          cells
            .getDateCells(deserializeDate(props.date))
            .map(({ date, type, day }) => (
              <CalendarCell class={[type, day]}>{date}</CalendarCell>
            ))}
        {props.type === 'week' &&
          cells
            .getWeekCells(deserializeDate(props.date))
            .map(({ days }, index) => (
              <CalendarCell>{`${index}(${days.toString()})`}</CalendarCell>
            ))}
        {props.type === 'month' &&
          cells
            .getMonthCells(deserializeDate(props.date))
            .map(month => <CalendarCell>{month}</CalendarCell>)}
        {props.type === 'year' &&
          cells
            .getYearCells(deserializeDate(props.date))
            .map(year => <CalendarCell>{year}</CalendarCell>)}
      </div>
    )
  },
})
