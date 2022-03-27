import { MONTH_A_YEAR } from './constants'

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
  from: WeekStartsFrom = 'sun'
) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const lastDayOfLastMonth = new Date(year, month - 1, 0)

  const startingMargin = firstDay.getDay() - (from === 'sun' ? 0 : 1)
  const endingMargin = (6 - lastDay.getDay() + (from === 'sun' ? 0 : 1)) % 7
  const totalCells = lastDay.getDate() + startingMargin + endingMargin

  return [...Array(totalCells)]
    .map((_, key) => key + 1)
    .map(item => {
      if (item <= startingMargin) {
        return {
          date: lastDayOfLastMonth.getDate() - startingMargin + item,
          position: 'last',
          day: refTable[lastDayOfLastMonth.getDay() - startingMargin + item],
          month: year * MONTH_A_YEAR + month - 1,
        }
      }

      if (item > lastDay.getDate() + startingMargin) {
        return {
          date: item - startingMargin - lastDay.getDate(),
          position: 'next',
          day: refTable[item - startingMargin - lastDay.getDate()],
          month: year * MONTH_A_YEAR + month + 1,
        }
      }

      return {
        date: item - startingMargin,
        position: 'current',
        day: refTable[(firstDay.getDay() + item - startingMargin - 1) % 7],
        month: year * MONTH_A_YEAR + month,
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
  const marginWeek = {
    month,
    days: [...Array(startingMargin)].map((_, key) => key + 1),
  }
  const normalWeeks = [
    ...[...Array(totalWeeks - 1)].map(() => 7),
    (lastDay.getDate() - startingMargin) % 7,
  ].map((item, key) => ({
    month,
    days: [...Array(item)].map((_, day) => day + 1 + key * 7 + startingMargin),
  }))

  return [marginWeek, ...normalWeeks]
}

export const getMonthCells = () => [...Array(12)].map((_, key) => `${key + 1}`)

export const getYearCells = ({ year }: { year: number }) =>
  [...Array(12)].map((_, key) => (key + year - ((year - 1970) % 12)).toString())
