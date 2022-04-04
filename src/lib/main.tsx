import { computed, defineComponent, PropType, reactive } from 'vue'
import CalendarBody from './components/CalendarBody'
import CalendarHeader from './components/CalendarHeader'
import { defaults, Options } from './options'
import { payloadToDate, serializeDate } from './utils'
import { CELLS_IN_BLOCK, MONTH_A_YEAR } from './constants'

export default defineComponent({
  props: {
    selected: {
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
  emits: ['update:select', 'update:start', 'update:end'],

  setup(props, { emit }) {
    const options = {
      ...defaults,
      ...props.options,
    }

    const calendarState = reactive({
      selectedStart: null as number | null,
      hovered: null as number | null,
      selectedEnd: null as number | null,
      currentDate: serializeDate(options.startDate),
      currentType: options.type,
    })

    const dateOffset = computed(() => {
      return calendarState.currentType === 'year'
        ? MONTH_A_YEAR * CELLS_IN_BLOCK
        : calendarState.currentType === 'month'
        ? MONTH_A_YEAR
        : 1
    })

    const handleSwitch = (direction: 1 | -1 = 1) => {
      calendarState.currentDate += dateOffset.value * direction * options.count
    }

    const bound = computed<{
      upper: number | null
      lower: number | null
    }>(() => {
      const start = calendarState.selectedStart
      const end = calendarState.selectedEnd || calendarState.hovered

      if (!start || !end)
        return {
          upper: null,
          lower: null,
        }

      return {
        upper: start > end ? start : end,
        lower: start > end ? end : start,
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
      // Switch type
      if (calendarState.currentType !== options.type) {
        calendarState.currentDate = payload

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
        calendarState.selectedStart = calendarState.s = payload
        emit('update:select', payloadToDate(payload))
        return
      }

      if (calendarState.selectedStart && calendarState.selectedEnd) {
        calendarState.selectedStart = payload
        calendarState.selectedEnd = null
        emit('update:start', payloadToDate(payload))
        emit('update:end', null)
        return
      }

      if (calendarState.selectedStart == null) {
        calendarState.selectedStart = payload
        emit('update:start', payloadToDate(payload))
      } else {
        calendarState.selectedEnd = payload
        emit('update:end', null)
      }
    }

    return () => (
      <div class="calendar-wrapper">
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
              isSelecting={!calendarState.selectedEnd}
              onCellHovered={handleCellHovered}
              onCellSelected={handleCellSelect}
            />
          </div>
        ))}
      </div>
    )
  },
})
