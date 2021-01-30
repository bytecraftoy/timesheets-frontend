import {
  lastDayOfMonth,
  lastDayOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'

const today = new Date()

const getFirstDayOfMonth = (monthsAgo: number): Date => {
  const firstDay = startOfMonth(subMonths(today, monthsAgo))
  return firstDay
}

const getLastDayOfLastMonth = (): Date => {
  const lastDay = lastDayOfMonth(subMonths(today, 1))

  return lastDay
}

const getFirstDayOfLastYear = (): Date => {
  const firstDay = startOfYear(subYears(today, 1))
  return firstDay
}

const getLastDayOfLastYear = (): Date => {
  const lastDay = lastDayOfYear(subYears(today, 1))
  return lastDay
}

export { getFirstDayOfMonth, getLastDayOfLastMonth, getFirstDayOfLastYear, getLastDayOfLastYear }
