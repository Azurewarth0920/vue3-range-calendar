import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    return () => <button>{slots.default?.()}</button>
  },
})
