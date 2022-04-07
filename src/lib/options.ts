export type Span = {
  unit: 'day' | 'week' | 'month' | 'year'
  value: number
}

export type Options = {
  startDate?: Date | string
  endDate?: Date | null
  isRange?:
    | {
        minSpan?: Span
        maxSpan?: Span
      }
    | false
  available?: [{ from?: Date; to?: Date }]
  unavailable?: [{ from?: Date; to?: Date }]
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
