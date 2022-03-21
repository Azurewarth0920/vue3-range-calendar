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
  emits: ['prevClicked', 'nextClicked', 'yearClicked', 'monthClicked'],
  setup(props, { emit }) {
    const time = computed(() => {
      const { year, month } = deserializeDate(props.date)
      return {
        year: props.type === 'year' ? year + props.offset : year,
        month: props.type !== 'year' ? month + props.offset : month,
      }
    })

    return () => (
      <div>
        {props.showGoPrev && (
          <button onClick={() => emit('prevClicked')}>Prev</button>
        )}
        <button onClick={() => emit('yearClicked')}>
          <span>{time.value.year}</span>
          <span>Year</span>
        </button>
        {props.type !== 'year' && (
          <button onClick={() => emit('monthClicked')}>
            <span>{time.value.month}</span>
            <span>Month</span>
          </button>
        )}
        {props.showGoNext && (
          <button onClick={() => emit('nextClicked')}>Next</button>
        )}
      </div>
    )
  },
})
