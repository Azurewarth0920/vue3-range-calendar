<template>
  <daterange-picker :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const options = {
      type: 'date',
      isRange: {
        maxSpan: {
          value: 3,
          unit: 'day',
        },
      },
    }

    return {
      options,
    }
  },
})
</script>
