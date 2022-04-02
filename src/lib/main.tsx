import { computed, defineComponent, PropType, reactive } from 'vue'
import CalendarBody from './components/CalendarBody'
import CalendarHeader from './components/CalendarHeader'
import { defaults, Options } from './options'
import { serializeDate } from './utils/normalizedDate'
import { CELLS_IN_BLOCK, MONTH_A_YEAR } from './constants'

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<Options>,
      default: () => {},
    },
  },
  setup(props) {
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
      if (calendarState.currentType === 'month') {
        calendarState.currentType = 'year'
        return
      }
      calendarState.currentType = 'month'
    }

    const handleCellHovered = (payload: number) => {
      calendarState.hovered = payload
    }

    const handleCellSelect = (payload: number) => {
      // Switch type
      if (calendarState.currentType !== options.type) {
        calendarState.currentDate = payload

        calendarState.currentType = {
          year: 'month',
          month: options.type,
        }[calendarState.currentType as 'month' | 'year'] as Options['type']

        return
      }

      // Selecting
      if (calendarState.selectedStart && calendarState.selectedEnd) {
        calendarState.selectedStart = payload
        calendarState.selectedEnd = null
        return
      }

      if (calendarState.selectedStart == null) {
        calendarState.selectedStart = payload
      } else {
        calendarState.selectedEnd = payload
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
