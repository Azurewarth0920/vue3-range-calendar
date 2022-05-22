import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from 'vue'
import CalendarBody from './components/CalendarBody'
import CalendarHeader from './components/CalendarHeader'
import CalendarFooter from './components/CalendarFooter'
import { defaults, Options } from './options'
import {
  calculateSpan,
  calculateWeekSpan,
  calculateFixedSpan,
  serializeDate,
  toPaddingNumber,
  trimTime,
  expandUnavailableSpan,
} from './utils'
import { CELLS_IN_BLOCK, MONTH_A_YEAR } from './constants'
import { useElementPosition } from './hooks/useElementPosition'
import TimePickerFrom from './components/TimePickerFrom'
import TimePickerTo from './components/TimePickerTo'

export default defineComponent({
  props: {
    select: {
      type: String,
      default: null,
    },
    start: {
      type: String,
      default: null,
    },
    end: {
      type: String,
      default: null,
    },
    options: {
      type: Object as PropType<Options>,
      default: () => ({}),
    },
  },
  emits: ['update:select', 'update:start', 'update:end', 'apply', 'cancel'],
  setup(props, { emit }) {
    const options = computed(() => {
      return {
        ...defaults,
        ...props.options,
      }
    })

    const internalState = reactive({
      passiveStart: options.value.singleSelectMode
        ? props.select
          ? options.value.serializer(props.select).getTime()
          : (null as number | null)
        : props.start
        ? options.value.serializer(props.start).getTime()
        : (null as number | null),
      passiveEnd: options.value.singleSelectMode
        ? props.select
          ? options.value.serializer(props.select).getTime()
          : (null as number | null)
        : props.end
        ? options.value.serializer(props.end).getTime()
        : (null as number | null),
      hovered: null as number | null,
      currentDate: serializeDate(
        options.value.singleSelectMode ? props.select : props.start
      ),
      currentType: options.value.type,
    })

    const calendarRef = ref<HTMLDivElement | null>(null)

    const start = computed<number | null>({
      get: () => {
        if (options.value.passive) {
          return internalState.passiveStart
        }

        if (options.value.singleSelectMode) {
          return props.select
            ? options.value.serializer(props.select).getTime()
            : null
        }

        return props.start
          ? options.value.serializer(props.start).getTime()
          : null
      },
      set: (time: number | null) => {
        if (options.value.passive) {
          internalState.passiveStart = time
          return
        }

        const payload = time ? options.value.deserializer(new Date(time)) : null

        if (options.value.singleSelectMode) {
          return emit('update:select', payload)
        }
        emit('update:start', payload)
      },
    })

    const end = computed<number | null>({
      get: () => {
        if (options.value.passive) {
          return internalState.passiveEnd
        }
        return props.end ? options.value.serializer(props.end).getTime() : null
      },
      set: (time: number | null) => {
        if (options.value.passive) {
          internalState.passiveEnd = time
        }

        emit(
          'update:end',
          time ? options.value.deserializer(new Date(time)) : null
        )
      },
    })

    const timeStart = computed({
      get: () => {
        if (!start.value) return '-:-'
        const date = new Date(start.value)
        return `${toPaddingNumber(date.getHours())}:${toPaddingNumber(
          date.getMinutes()
        )}`
      },
      set: (value: string) => {
        const [hour, minute] = value
          .split(':')
          .map(item => parseInt(item || '0', 10))
        start.value = start.value
          ? trimTime(new Date(start.value), hour || 0, minute || 0)
          : null
      },
    })

    const timeEnd = computed({
      get: () => {
        if (!end.value) return '-:-'
        const date = new Date(end.value)
        return `${toPaddingNumber(date.getHours())}:${toPaddingNumber(
          date.getMinutes()
        )}`
      },
      set: (value: string) => {
        const [hour, minute] = value
          .split(':')
          .map(item => parseInt(item || '0', 10))
        end.value = end.value
          ? trimTime(new Date(end.value), hour || 0, minute || 0)
          : null
      },
    })

    const dateOffset = computed(() => {
      return internalState.currentType === 'year'
        ? MONTH_A_YEAR * CELLS_IN_BLOCK
        : internalState.currentType === 'month'
        ? MONTH_A_YEAR
        : 1
    })

    const attachedStyles = ref<{ [key: string]: unknown }>({})

    const mountAttachmentStyle = () => {
      if (
        !options.value.attachElement ||
        !calendarRef.value ||
        !options.value.attachElement.value
      )
        return
      attachedStyles.value = {
        ...useElementPosition(
          options.value.attachElement.value,
          calendarRef.value,
          options.value.attachDirection
        ),
        visibility: 'visible',
      }
    }

    onMounted(() => {
      mountAttachmentStyle()
    })

    watch(
      () => options.value.attachDirection,
      () => {
        mountAttachmentStyle()
      }
    )

    const handleSwitch = (direction: 1 | -1 = 1) => {
      internalState.currentDate +=
        dateOffset.value * direction * options.value.count
    }

    const bound = computed<{
      upper: number | null
      lower: number | null
    }>(() => {
      const leftEdge = start.value
      const rightEdge = end.value || internalState.hovered

      if (!leftEdge || !rightEdge)
        return {
          upper: null,
          lower: null,
        }

      return {
        upper: trimTime(new Date(leftEdge > rightEdge ? leftEdge : rightEdge)),
        lower: trimTime(new Date(leftEdge > rightEdge ? rightEdge : leftEdge)),
      }
    })

    const unavailable = computed<[number, number][]>(() => {
      return (
        options.value.unavailable?.map(({ from, to }) => [
          from
            ? expandUnavailableSpan(
                from,
                options.value.type,
                options.value.fixedSpan * -1
              )
            : Number.POSITIVE_INFINITY,
          to
            ? expandUnavailableSpan(
                to,
                options.value.type,
                options.value.fixedSpan
              )
            : Number.NEGATIVE_INFINITY,
        ]) ?? []
      )
    })

    const maxRange = computed(() => {
      if (!start.value || options.value.singleSelectMode) {
        return
      }

      return {
        maxUpper: options.value.maxSpan
          ? calculateSpan(
              start.value,
              options.value.maxSpan,
              options.value.type
            )
          : undefined,
        maxLower: options.value.maxSpan
          ? calculateSpan(
              start.value,
              options.value.maxSpan,
              options.value.type,
              -1
            )
          : undefined,
        minUpper: options.value.minSpan
          ? calculateSpan(
              start.value,
              options.value.minSpan,
              options.value.type,
              1,
              -1
            )
          : undefined,
        minLower: options.value.minSpan
          ? calculateSpan(
              start.value,
              options.value.minSpan,
              options.value.type,
              -1,
              1
            )
          : undefined,
      }
    })

    const handleSwitchType = () => {
      internalState.currentType =
        internalState.currentType === 'month' ? 'year' : 'month'
    }

    const handleCellHovered = (payload: number) => {
      if (options.value.singleSelectMode) return
      internalState.hovered = payload
    }

    const handleCellSelect = (payload: number) => {
      // Switch type
      if (internalState.currentType !== options.value.type) {
        internalState.currentDate =
          new Date(payload).getFullYear() * MONTH_A_YEAR +
          new Date(payload).getMonth()

        switch (internalState.currentType) {
          case 'year':
            internalState.currentType = 'month'
            return
          case 'month':
            internalState.currentType = options.value.type
            return
        }
      }

      // Select value
      if (options.value.singleSelectMode) {
        start.value = end.value = payload
        return
      }

      // Week mode or fixed span mode
      if (options.value.type === 'week') {
        const { upper, lower } = calculateWeekSpan(
          payload,
          options.value.weekOffset,
          options.value.weekSpan?.from ?? 0,
          options.value.weekSpan?.to ?? 6
        )
        start.value = lower
        end.value = upper
        return
      }

      if (options.value.fixedSpan) {
        const { upper, lower } = calculateFixedSpan(
          payload,
          options.value.fixedSpan,
          options.value.type
        )

        start.value = lower
        end.value = upper
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
      return !!(options.value.singleSelectMode
        ? start.value && end.value
        : start.value)
    })

    const isSameDay = computed(
      () => !!bound.value.upper && bound.value.upper === bound.value.lower
    )

    const handleApply = () => {
      const payload = options.value.singleSelectMode
        ? {
            start: start.value ? new Date(start.value) : null,
            end: end.value ? new Date(end.value) : null,
          }
        : {
            select: start.value ? new Date(start.value) : null,
          }
      emit('apply', payload)
    }

    const isTimeRanged = computed(
      () =>
        !options.value.singleSelectMode || !options.value.time?.singleSelectMode
    )

    return () => (
      <div
        class={['calendar-wrapper', options.value.attachElement && '-attached']}
        style={attachedStyles.value}
        ref={calendarRef}
      >
        {[...Array(options.value.count)].map((_, index) => (
          <div class="calendar-unit">
            <CalendarHeader
              date={internalState.currentDate + index * dateOffset.value}
              type={internalState.currentType}
              showGoPrev={index === 0}
              showGoNext={index === options.value.count - 1}
              onPrevClicked={() => handleSwitch(-1)}
              onSwitchType={handleSwitchType}
              onNextClicked={handleSwitch}
            />
            <CalendarBody
              date={internalState.currentDate + index * dateOffset.value}
              type={internalState.currentType}
              bound={bound.value}
              formatters={options.value.formatters}
              unavailable={unavailable.value}
              maxRange={maxRange.value}
              isSelecting={!end.value}
              isCurrentType={internalState.currentType === options.value.type}
              onCellHovered={handleCellHovered}
              onCellSelected={handleCellSelect}
              locale={options.value.locale}
              weekSpan={options.value.weekSpan}
              weekOffset={options.value.weekOffset}
              fixedSpan={options.value.fixedSpan}
            />
            {index === 0 &&
              options.value.time &&
              ['week', 'date'].includes(internalState.currentType) && (
                <TimePickerFrom
                  tick={options.value.time?.tick}
                  span={options.value.time?.span}
                  isRange={isTimeRanged.value}
                  isSameDay={isSameDay.value}
                  v-model={timeStart.value}
                />
              )}
            {index === options.value.count - 1 &&
              options.value.time &&
              isTimeRanged.value &&
              ['week', 'date'].includes(internalState.currentType) && (
                <TimePickerTo
                  tick={options.value.time?.tick}
                  span={options.value.time?.span?.to}
                  isSameDay={isSameDay.value}
                  from={timeStart.value}
                  v-model={timeEnd.value}
                />
              )}
            {index === options.value.count - 1 && options.value.passive && (
              <CalendarFooter
                onApply={handleApply}
                onCancel={() => emit('cancel')}
                isSelected={isSelected.value}
                applyText={
                  typeof options.value.passive !== 'boolean' &&
                  options.value.passive.applyText
                }
                cancelText={
                  typeof options.value.passive !== 'boolean' &&
                  options.value.passive.cancelText
                }
              />
            )}
          </div>
        ))}
      </div>
    )
  },
})
