import { MONTH_A_YEAR } from '../constants'
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
  const rightOffset = Math.floor((span - 1) / 2)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const date = dateObj.getDate()

  switch (type) {
    case 'date':
      return {
        upper: new Date(year, month, date + rightOffset).getTime(),
        lower: new Date(year, month, date - leftOffset).getTime(),
      }

    case 'month':
      return {
        upper: new Date(year, month + rightOffset, date).getTime(),
        lower: new Date(year, month - leftOffset, date).getTime(),
      }

    case 'year':
      return {
        upper: new Date(year + rightOffset, month, date).getTime(),
        lower: new Date(year - leftOffset, month, date).getTime(),
      }
  }
}

export const calculateWeekSpan = (
  payload: number,
  offset = 0,
  from = 0,
  to = 6
) => {
  const date = new Date(payload)
  const dayOffset = Math.abs((date.getDay() + offset) % 7)

  return {
    upper: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + to - dayOffset
    ).getTime(),
    lower: new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + from - dayOffset
    ).getTime(),
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
