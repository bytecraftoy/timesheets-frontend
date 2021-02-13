import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import { SalaryReportData } from '../common/types'
import { formatDateFromString } from '../services/dateAndTimeService'

const SalaryReportPreview: React.FC<{ data: SalaryReportData }> = ({ data }) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography variant="subtitle1">{t('report.billing.preview.title')}</Typography>
      <Typography variant="h6">{data.employee.firstName}</Typography>
      <Typography variant="h6">
        {formatDateFromString(data.startDate)}
        {' – '}
        {formatDateFromString(data.endDate)}
      </Typography>
    </>
  )
}

export default SalaryReportPreview
