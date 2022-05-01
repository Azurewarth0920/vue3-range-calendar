import { Ref } from 'vue'
import { DateFormatterArgs, WeekFormatterArgs } from './cells'

export type Span = {
  unit: 'day' | 'week' | 'month' | 'year'
  value: number
}

export type Options = {
  startDate?: Date | string
  endDate?: Date | null
  attachElement?: Ref<HTMLElement | null>
  attachDirection: 'top' | 'left' | 'bottom' | 'right'
  isRange?:
    | {
        minSpan?: Span
        maxSpan?: Span
      }
    | false
  available?: { from?: Date; to?: Date }[]
  unavailable?: { from?: Date; to?: Date }[]
  passive?: true | { applyText?: string; cancelText?: string }
  time?: {
    tick?: number
    isRange: boolean
    span?: {
      from?: {
        hour?: number
        minute?: number
      }
      to?: {
        hour: number
        minute: number
      }
    }
  }
  count?: number
  locale?: string
  type: 'date' | 'week' | 'month' | 'year'
  formatters?: {
    date?: (payload: DateFormatterArgs) => string
    week?: (payload: WeekFormatterArgs) => string
    month?: (payload: { month: number; year: number }) => string
    year?: (payload: { year: number }) => string
  }
}

export const defaults = {
  startDate: new Date(),
  attachDirection: 'bottom',
  isRange: {},
  passive: false,
  count: 2,
  locale: 'en',
  type: 'date',
}
