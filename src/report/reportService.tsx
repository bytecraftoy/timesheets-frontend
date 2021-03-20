import qs from 'qs'
import { format } from 'date-fns'
import axios from '../services/axiosConfig'
import {
  BillingReportFormValues,
  BillingReportData,
  SalaryReportFormValues,
  SalaryReportData,
} from '../common/types'

const getBillingReportData = async (
  values: BillingReportFormValues,
  userId: string
): Promise<BillingReportData> => {
  const { data } = await axios(userId).get(`/report/client/${values.client}`, {
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

const getSalaryReportData = async (
  values: SalaryReportFormValues,
  userId: string
): Promise<SalaryReportData> => {
  const { data } = await axios(userId).get(`/report/employee/${values.employee}`, {
    params: {
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
      clients: values.clients,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
  return data as SalaryReportData
}

export { getBillingReportData, getSalaryReportData }
