import { defineComponent, PropType, reactive } from 'vue'
import CalendarBody from './components/CalendarBody'
import CalendarHeader from './components/CalendarHeader'
import { defaults, Options } from './options'
import merge from 'lodash.merge'
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
    const mergedOptions = merge(defaults, props.options)
    const calendarState = reactive({
      currentSelectedStart: mergedOptions.startDate,
      currentDate: serializeDate(mergedOptions.startDate),
      currentType: mergedOptions.type,
      // hovered place
    })

    // emit startDate select
    // emit endDate select
    // emit week selected
    const handleSwitchMonth = (direction: 1 | -1 = 1) => {
      const offset =
        calendarState.currentType === 'year'
          ? MONTH_A_YEAR * CELLS_IN_BLOCK
          : calendarState.currentType === 'month'
          ? MONTH_A_YEAR
          : 1

      calendarState.currentDate += offset * direction
    }

    const handleSwitchType = () => {
      if (calendarState.currentType === 'month') {
        calendarState.currentType = 'year'
        return
      }
      calendarState.currentType = 'month'
    }

    return () => (
      <div>
        {[...Array(mergedOptions.count)].map((_, index) => (
          <div class="calendar-wrapper">
            <CalendarHeader
              date={calendarState.currentDate}
              offset={index}
              type={calendarState.currentType}
              showGoPrev={index === 0}
              showGoNext={index === mergedOptions.count - 1}
              onPrevClicked={() => handleSwitchMonth(-1)}
              onSwitchType={() => handleSwitchType()}
              onNextClicked={() => handleSwitchMonth()}
            />
            <CalendarBody
              date={calendarState.currentDate + index}
              type={calendarState.currentType}
            />
          </div>
        ))}
      </div>
    )
  },
})
