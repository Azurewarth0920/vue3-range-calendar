import { MONTH_A_YEAR } from '../constants'
import { Span } from '../options'

export const serializeDate = (date: number | string | Date) => {
  const normalizedDate = date instanceof Date ? date : new Date(date)

  if (normalizedDate.toString() === 'Invalid Date') {
    throw new Error('Invalid date format')
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

export const payloadToDate = (payload: number) => new Date(payload)

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

export const trimTime = (date: Date, hour: number = 0, minute = 0) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute
  ).getTime()

export const toPaddingNumber = (num: number) => num.toString().padStart(2, '0')
