import axios from 'axios'
import qs from 'qs'
import { format } from 'date-fns'
import {
  BillingReportFormValues,
  BillingReportData,
  SalaryReportFormValues,
  SalaryReportData,
} from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

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

const getSalaryReportData = async (values: SalaryReportFormValues): Promise<SalaryReportData> => {
  const { data } = await axios.get(`${baseUrl}/report/employee/${values.employee}`, {
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
