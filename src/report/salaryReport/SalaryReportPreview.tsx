import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import SalaryReportSummaryTable from './SalaryReportSummaryTable'
import SalaryReportDetailsTable from './SalaryReportDetailsTable'
import { SalaryReportData } from '../../common/types'
import { formatDateFromString } from '../../services/dateAndTimeService'

const SalaryReportPreview: React.FC<{ data: SalaryReportData }> = ({ data }) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography variant="subtitle1">{t('report.salary.preview.title')}</Typography>
      <Typography variant="h6">{`${data.employee.firstName} ${data.employee.lastName}`}</Typography>
      <Typography variant="h6">
        {formatDateFromString(data.startDate)}
        {' – '}
        {formatDateFromString(data.endDate)}
      </Typography>
      <SalaryReportSummaryTable clients={data.clients} grandTotal={data.grandTotal} />
      <SalaryReportDetailsTable clients={data.clients} />
    </>
  )
}

export default SalaryReportPreview
