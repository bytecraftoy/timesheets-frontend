import {
  format,
  startOfWeek,
  addDays,
  lastDayOfMonth,
  lastDayOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
  isWeekend,
  getDay,
} from 'date-fns'
import { weekdays } from '../common/constants'

const today = new Date()

const formatDateFromString = (date: string): string => {
  return format(new Date(date), 'dd.MM.yyyy')
}

const formatDateFromDate = (date: Date): string => {
  return format(date, 'dd.MM.yyyy')
}

const formatDateFromStringWithWeekday = (dateString: string): string => {
  const date = new Date(dateString)
  const weekday = weekdays[getDay(date)]
  return `${weekday} ${format(date, 'd.M')}`
}

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
  const minutesLeft = minutes - roundedHours * 60
  return minutesLeft === 0 ? `${roundedHours} h` : `${roundedHours} h ${minutesLeft} m`
}

const getHolidays = (week: Date[]): boolean[] => {
  return week.map((day) => isWeekend(day))
}

export {
  formatDateFromString,
  formatDateFromDate,
  formatDateFromStringWithWeekday,
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
  getCurrentWeek,
  getWeekDays,
  minutesToHoursAndMinutes,
  getHolidays,
}
