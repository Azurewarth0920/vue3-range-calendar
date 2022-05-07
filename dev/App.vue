<template>
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
      type: 'week',
    }

    return {
      start,
      end,
      options,
    }
  },
})
</script>
