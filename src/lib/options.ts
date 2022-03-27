export type Options = {
  startDate?: Date | number | string
  isRange: {
    endDate?: string | Date | null
    minDate?: string | Date | null
    maxDate?: string | Date | null
    maxSpan?: [number, 'days' | 'weeks' | 'month' | 'years']
  } | null
  count: number
  type: 'date' | 'week' | 'month' | 'year'
}

export const defaults = {
  startDate: new Date(),
  isRange: null,
  count: 2,
  type: 'date',
}
