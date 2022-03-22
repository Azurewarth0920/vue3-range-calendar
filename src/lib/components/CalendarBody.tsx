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
      <div class={['calendar-body', `-${props.type}`]}>
        {props.type === 'date' &&
          cells
            .getDateCells(deserializeDate(props.date))
            .map(({ date, type, day }, index) => (
              <CalendarCell
                class={[`-${type}`, `-${day}`]}
                key={`${props.date}-${date}-${index}`}>
                {date}
              </CalendarCell>
            ))}
        {props.type === 'week' &&
          cells
            .getWeekCells(deserializeDate(props.date))
            .map(({ days }, index) => (
              <CalendarCell
                key={`${props.date}-${index}`}>{`${index}(${days.toString()})`}</CalendarCell>
            ))}
        {props.type === 'month' &&
          cells
            .getMonthCells(deserializeDate(props.date))
            .map(month => (
              <CalendarCell key={`${props.date}-${month}`}>
                {month}
              </CalendarCell>
            ))}
        {props.type === 'year' &&
          cells
            .getYearCells(deserializeDate(props.date))
            .map(year => (
              <CalendarCell key={`${props.date}-${year}`}>{year}</CalendarCell>
            ))}
      </div>
    )
  },
})
