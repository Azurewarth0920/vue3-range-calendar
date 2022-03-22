import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    return () => <button class="calendar-cell">{slots.default?.()}</button>
  },
})
