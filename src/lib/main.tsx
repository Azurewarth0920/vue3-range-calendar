import { defineComponent, PropType, reactive } from 'vue'
import CalendarBody from './components/CalendarBody'
import CalendarHeader from './components/CalendarHeader'
import { defaults, Options } from './options'
import merge from 'lodash.merge'
import { serializeDate } from './utils/normalizedDate'
import { MONTH_A_YEAR } from './constants'

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
        (['year', 'month'].includes(calendarState.currentType)
          ? MONTH_A_YEAR
          : 1) * direction
      calendarState.currentDate += offset
    }
    const handleSwitchType = (type: 'month' | 'year') => {
      calendarState.currentType = type
    }

    return () => (
      <div>
        {[...Array(mergedOptions.count)].map((_, index) => (
          <div>
            <CalendarHeader
              date={calendarState.currentDate}
              offset={index}
              type={calendarState.currentType}
              showGoPrev={index === 0}
              showGoNext={index === mergedOptions.count - 1}
              onPrevClicked={() => handleSwitchMonth(-1)}
              onYearClicked={() => handleSwitchType('year')}
              onMonthClicked={() => handleSwitchType('month')}
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
