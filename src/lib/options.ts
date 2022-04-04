export type Options = {
  startDate?: Date | number | string
  isRange: {
    endDate?: string | Date | null
    minDate?: string | Date | null
    maxDate?: string | Date | null
    minSpan?: [number, 'days' | 'weeks' | 'month' | 'years']
    maxSpan?: [number, 'days' | 'weeks' | 'month' | 'years']
  } | null
  count: number
  locale: string
  type: 'date' | 'week' | 'month' | 'year'
}

export const defaults = {
  startDate: new Date(),
  isRange: null,
  count: 2,
  locale: 'en',
  type: 'date',
}
