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

export const getDateCalendar = (
  year: number,
  month: number,
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
          type: 'last',
          day: refTable[lastDayOfLastMonth.getDay() - startingMargin + item],
        }
      }

      if (item > lastDay.getDate() + startingMargin) {
        return {
          date: item - startingMargin - lastDay.getDate(),
          type: 'next',
          day: refTable[item - startingMargin - lastDay.getDate()],
        }
      }

      return {
        date: item - startingMargin,
        type: 'current',
        day: refTable[(firstDay.getDay() + item - startingMargin - 1) % 7],
      }
    })
}

export const getWeekCalendar = (
  year: number,
  month: number,
  from: WeekStartsFrom = 'sun'
) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startingMargin = (7 - firstDay.getDay() - (from === 'sun' ? 0 : 1)) % 7
  const totalWeeks = Math.ceil((lastDay.getDate() - startingMargin) / 7)
  const marginWeek = {
    month,
    day: [...Array(startingMargin)].map((_, key) => key + 1),
  }
  const normalWeeks = [
    ...[...Array(totalWeeks - 1)].map(() => 7),
    (lastDay.getDate() - startingMargin) % 7,
  ].map((item, key) => ({
    month,
    day: [...Array(item)].map((_, day) => day + 1 + key * 7 + startingMargin),
  }))

  return [marginWeek, ...normalWeeks]
}
