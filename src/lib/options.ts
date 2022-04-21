import { Ref } from 'vue'

export type Span = {
  unit: 'day' | 'week' | 'month' | 'year'
  value: number
}

export type Options = {
  startDate?: Date | string
  endDate?: Date | null
  attachElement?: Ref<HTMLElement>
  attachDirection: 'top' | 'left' | 'bottom' | 'right'
  isRange?:
    | {
        minSpan?: Span
        maxSpan?: Span
      }
    | false
  available?: [{ from?: Date; to?: Date }]
  unavailable?: [{ from?: Date; to?: Date }]
  passive?: true | { applyText?: string; cancelText?: string }
  count: number
  locale: string
  type: 'date' | 'week' | 'month' | 'year'
}

export const defaults = {
  startDate: new Date(),
  attachDirection: 'bottom',
  isRange: null,
  passive: false,
  count: 2,
  locale: 'en',
  type: 'date',
}
