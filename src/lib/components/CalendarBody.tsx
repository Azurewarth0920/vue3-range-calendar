import { computed, defineComponent, PropType, ref, watchEffect } from 'vue'
import { Options } from '../options'
import CalendarCell from './CalendarCell'
import {
  table as cellTable,
  getDateCells,
  getWeekCells,
  getMonthCells,
  getYearCells,
} from '../cells'
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
        upper: number | null
        lower: number | null
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
      emit(eventName, parseInt(payload, 10))
    }

    const isInterval = (payload: number): string | false => {
      if (!props.bound.upper || !props.bound.lower) return false

      return (
        props.bound.upper > payload &&
        props.bound.lower < payload &&
        '-interval'
      )
    }

    const settledDate = ref<number | null>(null)

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

    const cells = computed(() => {
      return cellTable[props.type](deserializeDate(props.date))
    })

    const cellAttrs = computed<
      {
        payload: number
        formatter: string
        classNames?: string[]
      }[]
    >(() => {
      switch (props.type) {
        case 'date':
          return (cells.value as ReturnType<typeof getDateCells>).map(
            ({ date, position, day, month }) => ({
              classNames: [`-${position}`, `-${day}`],
              payload: parseInt(
                `${deserializeDate(props.date).year}${month
                  .toString()
                  .padStart(2, '0')}${date.toString().padStart(2, '0')}`
              ),
              formatter: date.toString(),
            })
          )
        case 'week':
          return (cells.value as ReturnType<typeof getWeekCells>).map(
            (days, index) => ({
              payload: parseInt(
                `${deserializeDate(props.date).year}${deserializeDate(
                  props.date
                )
                  .month.toString()
                  .padStart(2, '0')}${index.toString()}`
              ),
              formatter: days.toString(),
            })
          )
        case 'month':
          return (cells.value as ReturnType<typeof getMonthCells>).map(
            month => ({
              payload: parseInt(
                `${deserializeDate(props.date).year}${month
                  .toString()
                  .padStart(2, '0')}`
              ),
              formatter: month.toString(),
            })
          )
        case 'year':
          return (cells.value as ReturnType<typeof getYearCells>).map(year => ({
            payload: year,
            formatter: year.toString(),
          }))
      }
    })

    return () => (
      <div
        class={['calendar-body', `-${props.type}`]}
        onClick={e => handleMouseEvent(e, 'cellSelected')}
        onMouseover={e => handleMouseEvent(e, 'cellHovered')}>
        {cellAttrs.value.map(({ payload, classNames, formatter }) => (
          <CalendarCell
            class={[
              ...(classNames ? classNames : []),
              `-${props.type}`,
              props.bound.upper === payload && '-upper',
              props.bound.lower === payload && '-lower',
              settledDate.value === payload && '-settled',
              !props.isSelecting && '-selected',
              isInterval(payload),
            ]}
            key={payload}
            payload={payload}>
            {formatter}
          </CalendarCell>
        ))}
      </div>
    )
  },
})
