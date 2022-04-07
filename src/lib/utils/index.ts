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

export const payloadToDate = (payload: number): Date => {
  const matches = payload.toString().match(/(\d{4})(\d{2})?(\d{2})?/)
  if (matches) {
    const [_, year, month = 1, date = 1] = matches
    return new Date(`${year}-${month}-${date}`)
  } else {
    return new Date()
  }
}

export const dateToNumber = (date: Date): number =>
  parseInt(
    `${date.getFullYear()}${date.getMonth().toString().padStart(2, '0')}${date
      .getDay()
      .toString()
      .padStart(2, '0')}`,
    10
  )

export const calculateSpan = (
  payload: number,
  span: Span,
  direction: 1 | -1 = 1
): number => {
  const matches = payload.toString().match(/(\d{4})(\d{2})?(\d{2})?/)
  if (!matches) return payload

  let year = parseInt(matches[1], 10)
  let month = parseInt(matches[2] || '1', 10)
  let day = parseInt(matches[3] || '1', 10)

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

  return dateToNumber(new Date(year, month - 1, day))
}
