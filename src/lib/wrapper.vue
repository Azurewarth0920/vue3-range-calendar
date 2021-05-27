<template>
  <h1>component {{ count }}</h1>
  <button @click="count++">+</button>
  <button @click="count--">-</button>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  setup: () => {
    const count = ref(0)
    return { count }
  },
})
</script>
