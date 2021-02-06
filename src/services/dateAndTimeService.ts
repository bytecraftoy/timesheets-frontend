import {
  startOfWeek,
  addDays,
  lastDayOfMonth,
  lastDayOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'
import { weekdays } from '../common/constants'

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

const getCurrentWeek = (): Date[] => {
  const week: Date[] = [startOfWeek(new Date(), { weekStartsOn: 1 })]
  for (let i = 1; i < 7; i += 1) {
    week.push(addDays(week[week.length - 1], 1))
  }
  return week
}

const getWeekDays = (dates: Date[]): string[] => {
  return dates.map((day) => `${weekdays[day.getDay()]} ${day.getDate()}.${day.getMonth() + 1}.`)
}

const minutesToHoursAndMinutes = (minutes: number): string => {
  const hours = minutes / 60
  const roundedHours = Math.floor(hours)
  const minutesLeft = (hours - roundedHours) * 60
  const roundedMinutes = Math.floor(minutesLeft)
  return roundedMinutes === 0 ? `${roundedHours} h` : `${roundedHours} h ${roundedMinutes} m`
}

export {
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
  getCurrentWeek,
  getWeekDays,
  minutesToHoursAndMinutes,
}
