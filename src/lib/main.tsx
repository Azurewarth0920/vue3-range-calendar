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
    // props.options should merge
    const mergedOptions = {
      ...defaults,
      ...props.options,
    }
    const calendarState = reactive({
      selectedStart: null as string | null,
      hovered: null as string | null,
      selectedEnd: null as string | null,
      currentDate: serializeDate(mergedOptions.startDate),
      currentType: mergedOptions.type,
    })

    // emit startDate select
    // emit endDate select
    // emit week selected
    const dateOffset = computed(() => {
      return calendarState.currentType === 'year'
        ? MONTH_A_YEAR * CELLS_IN_BLOCK
        : calendarState.currentType === 'month'
        ? MONTH_A_YEAR
        : 1
    })

    const handleSwitchMonth = (direction: 1 | -1 = 1) => {
      calendarState.currentDate += dateOffset.value * direction
    }

    const bound = computed<{
      upper: [number, number] | null
      lower: [number, number] | null
    }>(() => {
      const start = calendarState.selectedStart
        ?.split('-')
        .map(item => parseInt(item, 10))
      const end = (calendarState.selectedEnd || calendarState.hovered)
        ?.split('-')
        .map(item => parseInt(item, 10))

      if (!start || !end)
        return {
          upper: null,
          lower: null,
        }

      return start[0] > end[0] || (start[0] === end[0] && start[1] > end[1])
        ? {
            upper: start as [number, number],
            lower: end as [number, number],
          }
        : {
            upper: end as [number, number],
            lower: start as [number, number],
          }
    })

    const handleSwitchType = () => {
      if (calendarState.currentType === 'month') {
        calendarState.currentType = 'year'
        return
      }
      calendarState.currentType = 'month'
    }

    const handleCellHovered = (payload: string) => {
      calendarState.hovered = payload
    }

    const handleCellSelect = (payload: string) => {
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
        {[...Array(mergedOptions.count)].map((_, index) => (
          <div class="calendar-unit">
            <CalendarHeader
              date={calendarState.currentDate + index * dateOffset.value}
              type={calendarState.currentType}
              showGoPrev={index === 0}
              showGoNext={index === mergedOptions.count - 1}
              onPrevClicked={() => handleSwitchMonth(-1)}
              onSwitchType={() => handleSwitchType()}
              onNextClicked={() => handleSwitchMonth()}
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
