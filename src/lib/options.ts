import { Ref } from 'vue'
import { DateFormatterArgs, WeekFormatterArgs } from './cells'
import { toPaddingNumber } from './utils'

export type Span = {
  unit: 'day' | 'week' | 'month' | 'year'
  value: number
}

export type Options = {
  startDate?: Date | string
  endDate?: Date | null
  attachElement?: Ref<HTMLElement | null>
  attachDirection?: 'top' | 'left' | 'bottom' | 'right'
  weekOffset?: number
  weekSpan?: {
    from?: number
    to?: number
  }
  fixedSpan?: number
  minSpan?: Span
  maxSpan?: Span
  unavailable?: { from?: Date; to?: Date }[]
  passive?: true | { applyText?: string; cancelText?: string }
  timeSelection?: true
  timeOptions?: {
    tick?: number
    singleSelectMode: false
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
  singleSelectMode?: boolean
  count?: number
  locale?: string
  type: 'date' | 'week' | 'month' | 'year'
  formatters?: {
    date?: (payload: DateFormatterArgs) => string
    week?: (payload: WeekFormatterArgs) => string
    month?: (payload: { month: number; year: number }) => string
    year?: (payload: { year: number }) => string
  }
  serializer?: (dateString: string) => Date
  deserializer?: (dateObj: Date) => string
}

export const defaults = {
  startDate: new Date(),
  attachDirection: 'bottom',
  count: 2,
  locale: 'en',
  type: 'date',
  weekOffset: 0,
  fixedSpan: 0,
  serializer: (dateString: string) => new Date(dateString),
  deserializer: (dateObj: Date) =>
    `${dateObj.getFullYear()}-${
      dateObj.getMonth() + 1
    }-${dateObj.getDate()} ${toPaddingNumber(
      dateObj.getHours()
    )}:${toPaddingNumber(dateObj.getMinutes())}`,
} as const
