import { MONTH_A_YEAR } from '../constants'

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
