<template>
  <p>start: <input type="text" v-model="start" /></p>
  <p>end: <input type="text" v-model="end" /></p>
  <p></p>
  <daterange-picker
    v-model:start="start"
    v-model:end="end"
    :options="options"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Options } from '../src/lib/options'

export default defineComponent({
  name: 'App',
  setup() {
    const start = ref<Date | null>(null)
    const end = ref<Date | null>(null)

    const options: Options = {
      type: 'date',
      weekOffset: 0,
      unavailable: [
        {
          from: new Date('2022-05-03'),
          to: new Date('2022-05-05'),
        },
      ],
    }

    return {
      start,
      end,
      options,
    }
  },
})
</script>
