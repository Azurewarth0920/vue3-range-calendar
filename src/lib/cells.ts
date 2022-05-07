import { MILLISECOND_A_DAY } from './constants'

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

  const startingMargin = Math.abs((firstDay.getDay() + offset) % 7)
  const endingMargin = (7 - ((lastDay.getDate() + startingMargin) % 7)) % 7
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

export const getWeekHeader = (locale: string = 'en', offset: number = 0) => {
  const FIRST_SUNDAY_TIME = 226800000
  return [...Array(7)]
    .map((_, index) => Math.abs(index - offset) % 7)
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
  week: getDateCells,
  fixed: getDateCells,
  month: getMonthCells,
  year: getYearCells,
}
