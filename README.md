# vue3-range-calendar

## Overview
vue3-range-calendar is a calendar UI component library for picking date, week, month, year ranges, with zero dependencies and high customizability for Vue3.

## Installation

### npm

```shell
yarn add vue3-range-calendar
# or
npm install vue3-range-calendar
```

Install component to the Vue instance.

```JavaScript
import { createApp } from 'vue'
import RangeCalendar from 'vue3-range-calendar'
import 'vue3-range-calendar/dist/styles/index.css'

const app = Vue.createApp({...})
app.use(RangeCalendar)
```

Then you can use component RangeCalendar on vue template.

eg.

```Vue
<script setup>
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
</script>


<template>
  <p>start: <input v-model="start" type="text" /></p>
  <p>end: <input v-model="end" type="text" /></p>
  <range-calendar v-model:start="start" v-model:end="end" />
</template>
```

## Docs

TBD