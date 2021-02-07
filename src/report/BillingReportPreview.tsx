import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import BillingReportSummaryTable from './BillingReportSummaryTable'
import BillingReportDetailsTable from './BillingReportDetailsTable'
import { BillingReportData } from '../common/types'
import { formatDateFromString } from '../services/dateAndTimeService'

const BillingReportPreview: React.FC<{ data: BillingReportData }> = ({ data }) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography variant="subtitle1">{t('report.billing.preview.title')}</Typography>
      <Typography variant="h6">{data.client.name}</Typography>
      <Typography variant="h6">
        {formatDateFromString(data.startDate)}
        {' – '}
        {formatDateFromString(data.endDate)}
      </Typography>
      <BillingReportSummaryTable projects={data.projects} grandTotal={data.grandTotal} />
      <BillingReportDetailsTable projects={data.projects} />
    </>
  )
}

export default BillingReportPreview
