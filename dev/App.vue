<template>
  <button ref="button" @click="activated = !activated">button</button>
  <daterange-picker :options="options" v-if="activated" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const activated = ref(false)
    const button = ref<HTMLElement | null>(null)

    const options = {
      type: 'date',
      attachDirection: 'bottom',
      attachElement: button,
      isRange: {
        maxSpan: {
          value: 3,
          unit: 'day',
        },
      },
    }

    return {
      options,
      button,
      activated,
    }
  },
})
</script>
