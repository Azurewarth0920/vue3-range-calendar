import { defineComponent, PropType } from 'vue'
import { Preset } from '../options'

export default defineComponent({
  props: {
    presets: {
      type: Object as PropType<Preset[]>,
      required: true,
    },
    start: {
      type: Number,
      default: null,
    },
    end: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:start', 'update:end'],
  setup(props, { emit }) {
    const handleClick = (modifier: Preset['modifier']) => {
      const { start, end } = modifier({
        start: new Date(props.start),
        end: new Date(props.end),
      })
      emit('update:start', start.getTime())
      emit('update:end', end.getTime())
    }

    const isMatched = (matcher: Preset['matcher']) => {
      if (!matcher) return false
      return matcher({
        start: new Date(props.start),
        end: new Date(props.end),
      })
    }

    return (
      <ul class="calendar-presets">
        {props.presets.map(preset => (
          <li class="calendar-presets_list">
            <button
              class={[
                'calendar-preset',
                isMatched(preset.matcher) && '-active',
              ]}
              onClick={() => handleClick(preset.modifier)}
            >
              {preset.text}
            </button>
          </li>
        ))}
      </ul>
    )
  },
})
