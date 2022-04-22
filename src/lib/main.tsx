import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
} from 'vue'
import CalendarBody from './components/CalendarBody'
import CalendarHeader from './components/CalendarHeader'
import CalendarFooter from './components/CalendarFooter'
import { defaults, Options } from './options'
import { calculateSpan, payloadToDate, serializeDate, trimTime } from './utils'
import { CELLS_IN_BLOCK, MONTH_A_YEAR } from './constants'
import { useElementPosition } from './hooks/useElementPosition'

export default defineComponent({
  props: {
    select: {
      type: Object as PropType<Date>,
      default: null,
    },
    start: {
      type: Object as PropType<Date>,
      default: null,
    },
    end: {
      type: Object as PropType<Date>,
      default: null,
    },
    options: {
      type: Object as PropType<Options>,
      default: () => {},
    },
  },
  emits: ['update:select', 'update:start', 'update:end', 'apply', 'cancel'],

  setup(props, { emit }) {
    const options = {
      ...defaults,
      ...props.options,
    }

    const calendarState = reactive({
      passiveStart:
        (options.isRange ? props.start?.getTime() : props.select?.getTime()) ||
        (null as number | null),
      passiveEnd:
        (options.isRange ? props.start?.getTime() : props.select?.getTime()) ||
        (null as number | null),
      hovered: null as number | null,
      currentDate: serializeDate(options.startDate),
      currentType: options.type,
    })

    const calendarRef = ref<HTMLDivElement | null>(null)

    const start = computed<number | null>({
      get: () => {
        if (options.passive) {
          return calendarState.passiveStart
        }
        return options.isRange
          ? props.start?.getTime() ?? null
          : props.select?.getTime() ?? null
      },
      set: (time: number | null) => {
        if (options.passive) {
          calendarState.passiveStart = time
          return
        }

        if (options.isRange) {
          emit('update:start', time ? payloadToDate(time) : null)
        } else {
          emit('update:select', time ? payloadToDate(time) : null)
        }
      },
    })

    const end = computed<number | null>({
      get: () => {
        if (options.passive) {
          return calendarState.passiveEnd
        }
        return props.end?.getTime() ?? null
      },
      set: (time: number | null) => {
        if (options.passive) {
          calendarState.passiveEnd = time
        }

        emit('update:end', time ? payloadToDate(time) : null)
      },
    })

    const dateOffset = computed(() => {
      return calendarState.currentType === 'year'
        ? MONTH_A_YEAR * CELLS_IN_BLOCK
        : calendarState.currentType === 'month'
        ? MONTH_A_YEAR
        : 1
    })

    const attachedStyles = ref<{ [key: string]: unknown }>({})

    onMounted(() => {
      if (!options.attachElement || !calendarRef.value) return
      attachedStyles.value = {
        ...useElementPosition(
          options.attachElement.value,
          calendarRef.value,
          options.attachDirection
        ),
        visibility: 'visible',
      }
    })

    const handleSwitch = (direction: 1 | -1 = 1) => {
      calendarState.currentDate += dateOffset.value * direction * options.count
    }

    const bound = computed<{
      upper: number | null
      lower: number | null
    }>(() => {
      const leftEdge = start.value
      const rightEdge = end.value || calendarState.hovered

      if (!leftEdge || !rightEdge)
        return {
          upper: null,
          lower: null,
        }

      return {
        upper: leftEdge > rightEdge ? leftEdge : rightEdge,
        lower: leftEdge > rightEdge ? rightEdge : leftEdge,
      }
    })

    const selectable = computed<{
      available: [number, number][] | undefined
      unavailable: [number, number][] | undefined
    }>(() => {
      return {
        available: props.options.available?.map(({ from, to }) => [
          from ? trimTime(from) : Number.POSITIVE_INFINITY,
          to ? trimTime(to) : Number.NEGATIVE_INFINITY,
        ]),
        unavailable: props.options.unavailable?.map(({ from, to }) => [
          from ? trimTime(from) : Number.POSITIVE_INFINITY,
          to ? trimTime(to) : Number.NEGATIVE_INFINITY,
        ]),
      }
    })

    const maxRange = computed(() => {
      if (!start.value || !props.options.isRange) {
        return
      }

      return {
        maxUpper: props.options.isRange.maxSpan
          ? calculateSpan(start.value, props.options.isRange.maxSpan)
          : undefined,
        maxLower: props.options.isRange.maxSpan
          ? calculateSpan(start.value, props.options.isRange.maxSpan, -1)
          : undefined,
        minUpper: props.options.isRange.minSpan
          ? calculateSpan(start.value, props.options.isRange.minSpan)
          : undefined,
        minLower: props.options.isRange.minSpan
          ? calculateSpan(start.value, props.options.isRange.minSpan, -1)
          : undefined,
      }
    })

    const handleSwitchType = () => {
      calendarState.currentType =
        calendarState.currentType === 'month' ? 'year' : 'month'
    }

    const handleCellHovered = (payload: number) => {
      if (!options.isRange) return
      calendarState.hovered = payload
    }

    const handleCellSelect = (payload: number) => {
      console.log(payload)

      // Switch type
      if (calendarState.currentType !== options.type) {
        calendarState.currentDate =
          payloadToDate(payload).getFullYear() * MONTH_A_YEAR +
          payloadToDate(payload).getMonth()

        switch (calendarState.currentType) {
          case 'year':
            calendarState.currentType = 'month'
            return
          case 'month':
            calendarState.currentType = options.type
            return
        }
      }

      // Select value
      if (!options.isRange) {
        start.value = end.value = payload
        return
      }

      if (start.value && end.value) {
        start.value = payload
        end.value = null
        return
      }

      if (start.value == null) {
        start.value = payload
      } else {
        end.value = payload
      }
    }

    const isSelected = computed(() => {
      return !!(options.isRange ? start.value && end.value : start.value)
    })

    const handleApply = () => {
      const payload = options.isRange
        ? {
            start: start.value ? payloadToDate(start.value) : null,
            end: end.value ? payloadToDate(end.value) : null,
          }
        : {
            select: start.value ? payloadToDate(start.value) : null,
          }
      emit('apply', payload)
    }

    const handleCancel = () => {
      emit('cancel')
    }

    return () => (
      <div
        class={['calendar-wrapper', options.attachElement && '-attached']}
        style={attachedStyles.value}
        ref={calendarRef}>
        {[...Array(options.count)].map((_, index) => (
          <div class="calendar-unit">
            <CalendarHeader
              date={calendarState.currentDate + index * dateOffset.value}
              type={calendarState.currentType}
              showGoPrev={index === 0}
              showGoNext={index === options.count - 1}
              onPrevClicked={() => handleSwitch(-1)}
              onSwitchType={handleSwitchType}
              onNextClicked={handleSwitch}
            />
            <CalendarBody
              date={calendarState.currentDate + index * dateOffset.value}
              type={calendarState.currentType}
              bound={bound.value}
              selectable={selectable.value}
              maxRange={maxRange.value}
              isSelecting={!end.value}
              onCellHovered={handleCellHovered}
              onCellSelected={handleCellSelect}
            />
            {index === options.count - 1 && options.passive && (
              <CalendarFooter
                onApply={handleApply}
                onCancel={handleCancel}
                isSelected={isSelected.value}
                applyText={
                  typeof options.passive !== 'boolean' &&
                  options.passive.applyText
                }
                cancelText={
                  typeof options.passive !== 'boolean' &&
                  options.passive.applyText
                }
              />
            )}
          </div>
        ))}
      </div>
    )
  },
})
