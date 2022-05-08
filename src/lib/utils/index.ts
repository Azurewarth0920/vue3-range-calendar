import { MONTH_A_YEAR, MILLISECOND_A_DAY } from '../constants'
import { Span } from '../options'

export const serializeDate = (date: number | string | Date | null) => {
  const normalizedDate =
    date instanceof Date ? date : date ? new Date(date) : new Date()

  if (normalizedDate.toString() === 'Invalid Date') {
    const today = new Date()
    return today.getFullYear() * MONTH_A_YEAR + today.getMonth()
  } else {
    return (
      normalizedDate.getFullYear() * MONTH_A_YEAR + normalizedDate.getMonth()
    )
  }
}

export const deserializeDate = (date: number) => {
  return {
    year: Math.floor(date / MONTH_A_YEAR),
    month: (date % MONTH_A_YEAR) + 1,
  }
}

export const calculateSpan = (
  payload: number,
  span: Span,
  direction: 1 | -1 = 1
): number => {
  const date = new Date(payload)

  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  switch (span.unit) {
    case 'day':
      day += span.value * direction
      break
    case 'week':
      day += span.value * direction * 7
      break
    case 'month':
      month += span.value * direction
      break
    case 'year':
      year += span.value * direction
      break
  }

  return new Date(year, month, day).getTime()
}

export const calculateFixedSpan = (
  payload: number,
  span: number,
  type: 'month' | 'year' | 'date'
) => {
  const dateObj = new Date(payload)
  const leftOffset = Math.ceil((span - 1) / 2)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const date = dateObj.getDate()
  let ticks = null

  switch (type) {
    case 'date':
      ticks = [...Array(span)].map(
        (_, i) => dateObj.getTime() + (i - leftOffset) * MILLISECOND_A_DAY
      )
      break

    case 'month':
      ticks = [...Array(span)].map((_, i) =>
        new Date(year, month + i - leftOffset, date).getTime()
      )
      break

    case 'year':
      ticks = [...Array(span)].map((_, i) =>
        new Date(year - leftOffset + i, month, date).getTime()
      )
      break
  }

  return {
    upper: ticks[ticks.length - 1],
    lower: ticks[0],
    ticks,
  }
}

export const calculateWeekSpan = (
  payload: number,
  offset = 0,
  from = 0,
  to = 6
) => {
  const date = new Date(payload)
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - Math.abs((date.getDay() + offset) % 7)
  ).getTime()

  const ticks = [...Array(to - from + 1)].map(
    (_, i) => start + i * MILLISECOND_A_DAY
  )

  return {
    upper: ticks[ticks.length - 1],
    lower: ticks[0],
    ticks,
  }
}

export const trimTime = (date: Date, hour: number = 0, minute = 0) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute
  ).getTime()

export const toPaddingNumber = (num: number) => num.toString().padStart(2, '0')
