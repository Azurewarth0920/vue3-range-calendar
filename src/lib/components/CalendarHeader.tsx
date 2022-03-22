import { computed, defineComponent, PropType, ref } from 'vue'
import { Options } from '../options'
import { deserializeDate } from '../utils/normalizedDate'

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
    showGoPrev: {
      type: Boolean,
      required: true,
    },
    showGoNext: {
      type: Boolean,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
  },
  emits: ['prevClicked', 'nextClicked', 'switchType'],
  setup(props, { emit }) {
    const time = computed(() => {
      const { year, month } = deserializeDate(props.date)
      return {
        year: props.type === 'year' ? year + props.offset : year,
        month: props.type !== 'year' ? month + props.offset : month,
      }
    })

    return () => (
      <div class="calendar-header">
        {props.showGoPrev && (
          <button
            class="calendar-header_button -prev"
            onClick={() => emit('prevClicked')}>
            Prev
          </button>
        )}
        <div>
          {props.type !== 'year' && (
            <button
              class="calendar-header_title"
              onClick={() => emit('switchType')}>
              <span>{time.value.year}</span>
              {props.type !== 'month' && <span> / {time.value.month}</span>}
            </button>
          )}
        </div>
        {props.showGoNext && (
          <button
            class="calendar-header_button -next"
            onClick={() => emit('nextClicked')}>
            Next
          </button>
        )}
      </div>
    )
  },
})
