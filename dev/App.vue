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
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
</script>
