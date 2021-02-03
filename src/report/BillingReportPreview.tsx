import React from 'react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import BillingReportSummaryTable from './BillingReportSummaryTable'
import BillingReportDetailsTable from './BillingReportDetailsTable'
import { BillingReportData } from '../common/types'

const BillingReportPreview: React.FC<{ data: BillingReportData }> = ({ data }) => {
  const { t } = useTranslation()

  const formatDate = (date: string): string => {
    return format(new Date(date), 'dd.MM.yyyy')
  }

  return (
    <>
      <Typography variant="subtitle1">{t('report.billing.preview.title')}</Typography>
      <Typography variant="h6">{data.client.name}</Typography>
      <Typography variant="h6">
        {formatDate(data.startDate)}
        {' – '}
        {formatDate(data.endDate)}
      </Typography>
      <BillingReportSummaryTable projects={data.projects} grandTotal={data.grandTotal} />
      <BillingReportDetailsTable projects={data.projects} />
    </>
  )
}

export default BillingReportPreview
