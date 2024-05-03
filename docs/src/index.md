# vue3-range-calendar

## Overview
vue3-range-calendar is a calendar UI component library for picking date, week, month, year ranges, with zero dependencies for Vue3.

## Installation

### npm

```shell
yarn add vue3-range-calendar
# or
npm install vue3-range-calendar
```

then install component to app instance

```JavaScript
import { createApp } from 'vue'
import rangeCalendar from 'vue3-range-calendar'
import 'vue3-range-calendar/styles/index.css'

const app = Vue.createApp({...})
app.use(rangeCalendar)
```

### CDN
Or you can add through CDN held by unpkg like:
```HTML
  <script src="https://unpkg.com/vue3-range-calendar/dist/index.umd.js"></script>
```

And install through global object.

```JavaScript
const app = Vue.createApp({...})
app.use(window.rangeCalendar)
```