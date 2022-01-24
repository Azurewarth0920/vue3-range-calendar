
   
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const count = ref(0)

    return () => (
      <>
        <h1>component {count.value}</h1>

        <button onClick={() => count.value++}>+</button>
        <button onClick={() => count.value--}>-</button>
      </>
    );
  }
});