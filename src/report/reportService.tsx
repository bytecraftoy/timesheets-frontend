import qs from 'qs'
import axios from 'axios'
import { formatUnixDateFromDate } from '../services/dateAndTimeService'
import {
  BillingReportFormValues,
  BillingReportData,
  SalaryReportFormValues,
  SalaryReportData,
} from '../common/types'

const getBillingReportData = async (
  values: BillingReportFormValues
): Promise<BillingReportData> => {
  const { data } = await axios.get(`/report/client/${values.client}`, {
    params: {
      startDate: formatUnixDateFromDate(values.startDate),
      endDate: formatUnixDateFromDate(values.endDate),
      projects: values.projects,
      employees: values.employees,
      billable: values.billable,
      nonBillable: values.nonBillable,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
  return data as BillingReportData
}

const getSalaryReportData = async (values: SalaryReportFormValues): Promise<SalaryReportData> => {
  const { data } = await axios.get(`/report/employee/${values.employee}`, {
    params: {
      startDate: formatUnixDateFromDate(values.startDate),
      endDate: formatUnixDateFromDate(values.endDate),
      clients: values.clients,
      billable: values.billable,
      nonBillable: values.nonBillable,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
  return data as SalaryReportData
}

export { getBillingReportData, getSalaryReportData }
