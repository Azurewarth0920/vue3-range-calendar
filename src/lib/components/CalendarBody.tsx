import { computed, defineComponent, PropType, ref, watchEffect } from 'vue'
import { Options } from '../options'
import CalendarCell from './CalendarCell'
import {
  table as cellTable,
  getDateCells,
  getWeekCells,
  getMonthCells,
  getYearCells,
  getWeekHeader,
} from '../cells'
import { deserializeDate } from '../utils'

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
    selectable: {
      type: Object as PropType<{
        available: [number, number][] | undefined
        unavailable: [number, number][] | undefined
      }>,
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

    const isCellAvailable = (payload: number): '' | '-unavailable' => {
      if (props.maxRange) {
        const {
          maxUpper = Number.POSITIVE_INFINITY,
          maxLower = Number.NEGATIVE_INFINITY,
          minUpper = Number.NEGATIVE_INFINITY,
          minLower = Number.POSITIVE_INFINITY,
        } = props.maxRange
        if (
          payload > maxUpper ||
          payload < maxLower ||
          payload < minUpper ||
          payload > minLower
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
      const { year, month } = deserializeDate(props.date)
      switch (props.type) {
        case 'date':
          return (cells.value as ReturnType<typeof getDateCells>).map(
            ({ date, position, day, month }) => ({
              classNames: [`-${position}`, `-${day}`],
              payload: new Date(year, month - 1, date).getTime(),
              formatter: date.toString(),
            })
          )
        case 'week':
          return (cells.value as ReturnType<typeof getWeekCells>).map(days => ({
            payload: new Date(year, month - 1, days[0]).getTime(),
            formatter: days.toString(),
          }))
        case 'month':
          return (cells.value as ReturnType<typeof getMonthCells>).map(
            month => ({
              payload: new Date(year, month - 1, 1).getTime(),
              formatter: month.toString(),
            })
          )
        case 'year':
          return (cells.value as ReturnType<typeof getYearCells>).map(year => ({
            payload: new Date(year, 0, 1).getTime(),
            formatter: year.toString(),
          }))
      }
    })

    return () => (
      <div
        class={['calendar-body', `-${props.type}`]}
        onClick={e => handleMouseEvent(e, 'cellSelected')}
        onMouseover={e => handleMouseEvent(e, 'cellHovered')}>
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
