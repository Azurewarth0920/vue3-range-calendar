<template>
  <button ref="attached" style="margin-top: 1000px">attached Element</button>
  <p>start: <input v-model="start" type="text" /></p>
  <p>end: <input v-model="end" type="text" /></p>
  <range-calendar v-model:start="start" v-model:end="end" :options="options" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Options } from '../src/lib/options'

export default defineComponent({
  name: 'App',
  setup() {
    const start = ref<Date | null>(null)
    const end = ref<Date | null>(null)
    const attached = ref<HTMLButtonElement | null>(null)

    const options: Options = {
      type: 'date',
      weekOffset: 0,
      unavailable: [
        {
          from: new Date('2022-05-03'),
          to: new Date('2022-05-05'),
        },
      ],
      attachElement: attached,
    }

    return {
      start,
      end,
      options,
      attached,
    }
  },
})
</script>
