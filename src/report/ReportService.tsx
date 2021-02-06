import axios from 'axios'
import qs from 'qs'
import {
  format,
  lastDayOfMonth,
  lastDayOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from 'date-fns'
import { BillingReportFormValues, BillingReportData } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST
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

const minutesToHoursAndMinutes = (minutes: number): string => {
  const hours = minutes / 60
  const roundedHours = Math.floor(hours)
  const minutesLeft = (hours - roundedHours) * 60
  const roundedMinutes = Math.floor(minutesLeft)
  return roundedMinutes === 0 ? `${roundedHours} h` : `${roundedHours} h ${roundedMinutes} m`
}

const getBillingReportData = async (
  values: BillingReportFormValues
): Promise<BillingReportData> => {
  const { data } = await axios.get(`${baseUrl}/report/client/${values.client}`, {
    params: {
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
      projects: values.projects,
      employees: values.employees,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
  return data as BillingReportData
}

export {
  getBillingReportData,
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
  minutesToHoursAndMinutes,
}
