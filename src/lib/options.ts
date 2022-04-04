type CalendarType = 'date' | 'week' | 'month' | 'year'
type Span = {
  unit: CalendarType
  value: number
}

export type Options = {
  startDate?: Date | number | string
  isRange:
    | {
        endDate?: string | Date | null
        minDate?: string | Date | null
        maxDate?: string | Date | null
        minSpan?: Span
        maxSpan?: Span
      }
    | boolean
  count: number
  locale: string
  type: CalendarType
}

export const defaults = {
  startDate: new Date(),
  isRange: null,
  count: 2,
  locale: 'en',
  type: 'date',
}
