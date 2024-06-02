# TypeScript support

You can use the type `Options` to help you defining your options.

```Vue
<script setup lang="ts">
import { Options } from 'vue3-range-calendar/types'

const options: Options = {
  ...
  // The options here will be type safe.
}
</script>

<template>
  <range-calendar :options="options" />
</template>
```