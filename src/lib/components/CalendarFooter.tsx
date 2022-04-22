import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    applyText: {
      type: [String, Boolean],
    },
    cancelText: {
      type: [String, Boolean],
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['apply', 'cancel'],
  setup(props, { emit }) {
    return () => (
      <div class="calendar-footer">
        <button onClick={() => emit('cancel')}>
          {props.cancelText || 'Cancel'}
        </button>
        <button onClick={() => emit('apply')} disabled={!props.isSelected}>
          {props.applyText || 'Apply'}
        </button>
      </div>
    )
  },
})
