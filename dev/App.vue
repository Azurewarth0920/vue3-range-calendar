<template>
  <p>
    Start: <input v-model="start" type="text" /> End:
    <input v-model="end" type="text" />
  </p>
  <hr />
  <range-calendar v-model:start="start" v-model:end="end" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Options } from '../src/types'
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
const today = new Date()

const options: Options = {
  presets: [
    {
      text: 'Last 7 days',
      modifier: () => {
        return {
          start: today,
          end: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        }
      },
    },
    {
      text: 'Last 30 days',
      modifier: () => {
        return {
          start: today,
          end: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        }
      },
    },
  ],
}
</script>
