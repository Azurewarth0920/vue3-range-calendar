import { computed, defineComponent, PropType, ref, watchEffect } from 'vue'
import { Options } from '../options'
import CalendarCell from './CalendarCell'
import {
  table as cellTable,
  getDateCells,
  getMonthCells,
  getYearCells,
  getWeekHeader,
  defaultFormatters,
} from '../cells'
import { calculateWeekSpan, deserializeDate, trimTime } from '../utils'

export default defineComponent({
  props: {
    date: {
      type: Number,
      required: true,
    },
    maxRange: {
      type: Object as PropType<
        | {
            maxUpper: number | undefined
            maxLower: number | undefined
            minUpper: number | undefined
            minLower: number | undefined
          }
        | undefined
      >,
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
    isCurrentType: {
      type: Boolean,
      required: true,
    },
    formatters: {
      type: Object as PropType<Options['formatters']>,
      default: null,
    },
    selectable: {
      type: Object as PropType<{
        available: [number, number][] | undefined
        unavailable: [number, number][] | undefined
      }>,
    },
  },
  emits: ['cellSelected', 'cellHovered'],
  setup(props, { emit }) {
    const today = trimTime(new Date())
    const formatters = props.formatters
      ? { ...defaultFormatters, ...props.formatters }
      : defaultFormatters

    const hoveringPayload = ref<number | null>(null)

    const handleMouseEvent = (
      event: MouseEvent,
      eventName: 'cellSelected' | 'cellHovered'
    ) => {
      const rawPayload = (event.target as HTMLButtonElement).getAttribute(
        'data-payload'
      )
      if (!rawPayload) return
      const parsedPayload = parseInt(rawPayload, 10)
      hoveringPayload.value = parsedPayload
      emit(eventName, parsedPayload)
    }

    const isInterval = (payload: number): '-interval' | false => {
      if (!props.bound.upper || !props.bound.lower || !props.isCurrentType)
        return false

      return (
        props.bound.upper > payload &&
        props.bound.lower < payload &&
        '-interval'
      )
    }

    const isSpanCell = (payload: number): string[] | string | false => {
      if (!hoveringPayload.value || props.type !== 'week') return false
      const { upper, lower } = calculateWeekSpan(hoveringPayload.value)

      if (upper === payload) return ['-span', '-span_upper']
      if (lower === payload) return ['-span', '-span_lower']
      return upper > payload && lower < payload && '-span'
    }

    const isCellAvailable = (payload: number): '' | '-unavailable' => {
      if (!props.isCurrentType) return ''

      if (props.maxRange && props.isSelecting) {
        const {
          maxUpper = Number.POSITIVE_INFINITY,
          maxLower = Number.NEGATIVE_INFINITY,
          minUpper = Number.NEGATIVE_INFINITY,
          minLower = Number.POSITIVE_INFINITY,
        } = props.maxRange
        if (
          payload >= maxUpper ||
          payload <= maxLower ||
          (payload <= minUpper && payload >= minLower)
        )
          return '-unavailable'
      }

      if (
        props.selectable?.available?.some(
          ([lower, upper]) => payload >= lower && payload <= upper
        )
      )
        return ''

      if (
        props.selectable?.unavailable?.some(
          ([lower, upper]) => payload >= lower && payload <= upper
        )
      )
        return '-unavailable'

      return ''
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
      const { year } = deserializeDate(props.date)
      switch (props.type) {
        case 'date':
        case 'week':
          return (cells.value as ReturnType<typeof getDateCells>).map(
            ({ date, position, day, month }) => {
              const payload = new Date(year, month - 1, date).getTime()
              return {
                classNames: [
                  `-${position}`,
                  `-${day}`,
                  today === payload && '-today',
                ],
                payload,
                formatter: formatters.date({
                  date,
                  position,
                  day,
                  month,
                  year,
                }),
              }
            }
          )
        case 'month':
          return (cells.value as ReturnType<typeof getMonthCells>).map(
            month => ({
              payload: new Date(year, month - 1, 1).getTime(),
              formatter: formatters.month({ year, month }),
            })
          )
        case 'year':
          return (cells.value as ReturnType<typeof getYearCells>).map(year => ({
            payload: new Date(year, 0, 1).getTime(),
            formatter: formatters.year({ year }),
          }))
      }
    })

    return () => (
      <div
        class={['calendar-body', `-${props.type}`]}
        onClick={e => handleMouseEvent(e, 'cellSelected')}
        onMouseover={e => handleMouseEvent(e, 'cellHovered')}
        onMouseout={() => (hoveringPayload.value = null)}>
        {props.type === 'date' &&
          getWeekHeader().map(shortName => (
            <span class="calendar-cell_leading">{shortName}</span>
          ))}
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
              isCellAvailable(payload),
              isSpanCell(payload),
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
