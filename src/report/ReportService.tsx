import { lastDayOfMonth, startOfMonth, subMonths } from 'date-fns'

const getFirstDayOfLastMonth = (): Date => {
  const today = new Date()
  const firstDay = startOfMonth(subMonths(today, 1))

  return firstDay
}

const getLastDayOfLastMonth = (): Date => {
  const today = new Date()
  const lastDay = lastDayOfMonth(subMonths(today, 1))

  return lastDay
}

export { getFirstDayOfLastMonth, getLastDayOfLastMonth }
