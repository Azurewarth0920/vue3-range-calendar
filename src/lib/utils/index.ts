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

export const payloadToDate = (payload: number): Date => {
  const matches = payload.toString().match(/(\d{4})(\d{2})?(\d{2})?/)
  if (matches) {
    const [_, year, month = 1, date = 1] = matches
    return new Date(`${year}-${month}-${date}`)
  } else {
    return new Date()
  }
}
