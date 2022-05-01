import { MILLISECOND_A_DAY, MONTH_A_YEAR } from './constants'

type WeekStartsFrom = 'mon' | 'sun'
const refTable: Record<number, string> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
}

export const getDateCells = (
  { year, month }: { year: number; month: number },
  offset: number = 0
) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const lastDayOfLastMonth = new Date(year, month - 1, 0)

  const startingMargin = firstDay.getDay() - (offset % 7)
  const endingMargin = (6 - lastDay.getDay() + (offset % 7)) % 7
  const totalCells = lastDay.getDate() + startingMargin + endingMargin

  return [...Array(totalCells)]
    .map((_, key) => key + 1)
    .map(item => {
      if (item <= startingMargin) {
        return {
          date: lastDayOfLastMonth.getDate() - startingMargin + item,
          position: 'last',
          day: refTable[
            (lastDayOfLastMonth.getDay() - startingMargin + item + offset) % 7
          ],
          month: month - 1,
        }
      }

      if (item > lastDay.getDate() + startingMargin) {
        return {
          date: item - startingMargin - lastDay.getDate(),
          position: 'next',
          day: refTable[
            (item - startingMargin - lastDay.getDate() + offset) % 7
          ],
          month: month + 1,
        }
      }

      return {
        date: item - startingMargin,
        position: 'current',
        day: refTable[
          (firstDay.getDay() + item - startingMargin - 1 + offset) % 7
        ],
        month: month,
      }
    })
}

export const getWeekCells = (
  { year, month }: { year: number; month: number },
  from: WeekStartsFrom = 'sun'
) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startingMargin = (7 - firstDay.getDay() - (from === 'sun' ? 0 : 1)) % 7
  const totalWeeks = Math.ceil((lastDay.getDate() - startingMargin) / 7)
  const marginWeek = [...Array(startingMargin)].map((_, key) => key + 1)

  const normalWeeks = [
    ...[...Array(totalWeeks - 1)].fill(7),
    lastDay.getDate() - startingMargin - (totalWeeks - 1) * 7,
  ].map((item, key) =>
    [...Array(item)].map((_, day) => day + 1 + key * 7 + startingMargin)
  )

  return marginWeek.length ? [marginWeek, ...normalWeeks] : normalWeeks
}

export const getWeekHeader = (locale: string = 'en', offset: number = 0) => {
  const FIRST_SUNDAY_TIME = 226800000
  return [...Array(7)]
    .map((_, index) => (index + offset) % 7)
    .map(day => new Date(FIRST_SUNDAY_TIME + MILLISECOND_A_DAY * day))
    .map(date =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'short',
      }).format(date)
    )
}

export const getMonthCells = () => [...Array(12)].map((_, key) => key + 1)

export const getYearCells = ({ year }: { year: number }) =>
  [...Array(12)].map((_, key) => key + year - ((year - 1970) % 12))

export type DateFormatterArgs = {
  date: number
  month: number
  year: number
  position: string
  day: string
}

export type WeekFormatterArgs = {
  month: number
  year: number
  days: number[]
  index: number
}

export type MonthFormatterArgs = { month: number; year: number }

export type YearFormatterArgs = { year: number }

export const defaultDateFormatter = ({ date }: DateFormatterArgs) =>
  date.toString()

export const defaultWeekFormatter = ({ days, index }: WeekFormatterArgs) =>
  `${index}W(${days[0]}~${days[days.length - 1]})`

export const defaultMonthFormatter = ({ month }: MonthFormatterArgs) =>
  month.toString()

export const defaultYearFormatter = ({ year }: YearFormatterArgs) =>
  year.toString()

export const defaultFormatters = {
  date: defaultDateFormatter,
  week: defaultWeekFormatter,
  month: defaultMonthFormatter,
  year: defaultYearFormatter,
}

export const table = {
  date: getDateCells,
  week: getWeekCells,
  month: getMonthCells,
  year: getYearCells,
}
