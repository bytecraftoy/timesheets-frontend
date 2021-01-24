import {
  lastDayOfMonth,
  lastDayOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'

const today = new Date()

const getFirstDayOfLastMonth = (): Date => {
  const firstDay = startOfMonth(subMonths(today, 1))

  return firstDay
}

const getLastDayOfLastMonth = (): Date => {
  const lastDay = lastDayOfMonth(subMonths(today, 1))

  return lastDay
}

const getFirstDayOfLastTwoMonths = (): Date => {
  const firstDay = startOfMonth(subMonths(today, 2))

  return firstDay
}

const getFirstDayOfLastSixMonths = (): Date => {
  const firstDay = startOfMonth(subMonths(today, 6))

  return firstDay
}

const getFirstDayOfLastYear = (): Date => {
  const firstDay = startOfYear(subYears(today, 1))
  return firstDay
}

const getLastDayOfLastYear = (): Date => {
  const lastDay = lastDayOfYear(subYears(today, 1))
  return lastDay
}

export {
  getFirstDayOfLastMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastTwoMonths,
  getFirstDayOfLastSixMonths,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
}
