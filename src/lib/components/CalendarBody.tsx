import { defineComponent, PropType, ref, watchEffect } from 'vue'
import { Options } from '../options'
import CalendarCell from './CalendarCell'
import * as cells from '../cells'
import { deserializeDate } from '../utils/normalizedDate'
import { MONTH_A_YEAR } from '../constants'

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
    bound: {
      type: Object as PropType<{
        upper: [number, number] | null
        lower: [number, number] | null
      }>,
      required: true,
    },
    isSelecting: {
      type: Boolean,
      required: true,
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
    ): string | false => {
      if (!props.bound.upper || !props.bound.lower) return false

      const [upperMonth, upperDate] = props.bound.upper
      const [lowerMonth, lowerDate] = props.bound.lower

      const isInterval =
        (upperMonth > currentMonth ||
          (upperMonth === currentMonth && upperDate > currentDate)) &&
        (currentMonth > lowerMonth ||
          (currentMonth === lowerMonth && currentDate > lowerDate))

      return isInterval && '-interval'
    }

    const settledDate = ref<[number, number] | null>(null)

    watchEffect(() => {
      if (props.bound.lower && props.bound.upper) {
        if (settledDate.value == null) {
          settledDate.value = props.bound.lower
        }
      }
    })

    watchEffect(() => {
      if (props.isSelecting) {
        settledDate.value = null
      }
    })

    return () => (
      <div
        class={['calendar-body', `-${props.type}`]}
        onClick={e => handleMouseEvent(e, 'cellSelected')}
        onMouseover={e => handleMouseEvent(e, 'cellHovered')}>
        {props.type === 'date' &&
          cells
            .getDateCells(deserializeDate(props.date))
            .map(({ date, position, day, month }) => (
              <CalendarCell
                class={[
                  `-${position}`,
                  `-${day}`,
                  `-${props.type}`,
                  props.bound.upper?.join('-') === `${month}-${date}` &&
                    '-upper',
                  props.bound.lower?.join('-') === `${month}-${date}` &&
                    '-lower',
                  settledDate.value?.join('-') === `${month}-${date}` &&
                    '-settled',
                  !props.isSelecting && '-selected',
                  getIntervalClass(month, date),
                ]}
                key={`${month}-${date}`}
                payload={`${month}-${date}`}>
                {date}
              </CalendarCell>
            ))}
        {props.type === 'week' &&
          cells
            .getWeekCells(deserializeDate(props.date))
            .map(({ days }, index) => (
              <CalendarCell
                class={[`-${props.type}`]}
                key={`${props.date}-${index}`}
                payload={`${props.date}-${index}`}>{`${index}(${days.toString()})`}</CalendarCell>
            ))}
        {props.type === 'month' &&
          cells.getMonthCells().map(month => (
            <CalendarCell
              class={[`-${props.type}`]}
              key={`${props.date}-${month}`}
              payload={(
                deserializeDate(props.date).year * MONTH_A_YEAR +
                parseInt(month, 10) -
                1
              ).toString()}>
              {month}
            </CalendarCell>
          ))}
        {props.type === 'year' &&
          cells.getYearCells(deserializeDate(props.date)).map(year => (
            <CalendarCell
              class={[`-${props.type}`]}
              key={`${props.date}-${year}`}
              payload={(parseInt(year, 10) * MONTH_A_YEAR).toString()}>
              {year}
            </CalendarCell>
          ))}
      </div>
    )
  },
})
