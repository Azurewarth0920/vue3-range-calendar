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
    upper: {
      type: Array as PropType<number[] | null>,
      default: null,
    },
    lower: {
      type: Array as PropType<number[] | null>,
      default: null,
    },
    isSelecting: {
      type: Boolean,
      required: true,
    },
    selectedStart: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
  emits: ['cellSelected', 'cellHovered'],
  setup(props, { emit }) {
    const handleMouseEvent = (
      event: MouseEvent,
      eventName: 'cellSelected' | 'cellHovered'
    ) => {
      const payload = (event.target as HTMLButtonElement).getAttribute(
        'data-payload'
      )
      if (!payload) return
      emit(eventName, payload)
    }

    const getIntervalClass = (
      currentMonth: number,
      currentDate: number
    ): string | null => {
      if (!props.upper || !props.lower) return null

      const [upperMonth, upperDate] = props.upper
      const [lowerMonth, lowerDate] = props.lower

      const isInterval =
        (upperMonth > currentMonth ||
          (upperMonth === currentMonth && upperDate >= currentDate)) &&
        (currentMonth > lowerMonth ||
          (currentMonth === lowerMonth && currentDate >= lowerDate))

      return isInterval
        ? props.isSelecting
          ? '-interval-selecting'
          : '-interval'
        : null
    }

    return () => (
      <div
        class={['calendar-body', `-${props.type}`]}
        onClick={e => handleMouseEvent(e, 'cellSelected')}
        onMouseover={e => handleMouseEvent(e, 'cellHovered')}>
        {props.type === 'date' &&
          cells
            .getDateCells(deserializeDate(props.date))
            .map(({ date, type, day, offset }, index) => (
              <CalendarCell
                class={[
                  `-${type}`,
                  `-${day}`,
                  props.upper?.join('-') === `${props.date + offset}-${date}` &&
                    '-upper',
                  props.lower?.join('-') === `${props.date + offset}-${date}` &&
                    '-lower',
                  props.selectedStart === `${props.date + offset}-${date}` &&
                    '-start',
                  getIntervalClass(props.date + offset, date),
                ]}
                key={`${props.date + offset}-${date}-${index}`}
                payload={`${props.date + offset}-${date}`}>
                {date}
              </CalendarCell>
            ))}
        {props.type === 'week' &&
          cells
            .getWeekCells(deserializeDate(props.date))
            .map(({ days }, index) => (
              <CalendarCell
                key={`${props.date}-${index}`}
                payload={`${props.date}-${index}`}>{`${index}(${days.toString()})`}</CalendarCell>
            ))}
        {props.type === 'month' &&
          cells.getMonthCells(deserializeDate(props.date)).map(month => (
            <CalendarCell key={`${props.date}-${month}`} payload={month}>
              {month}
            </CalendarCell>
          ))}
        {props.type === 'year' &&
          cells.getYearCells(deserializeDate(props.date)).map(year => (
            <CalendarCell key={`${props.date}-${year}`} payload={year}>
              {year}
            </CalendarCell>
          ))}
      </div>
    )
  },
})
