import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'

import BillingReportForm from './BillingReportForm'

const BillingReport: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Typography variant="h2" data-cy="reports-title">
        {t('reportsTitle')}
      </Typography>
      <Typography variant="subtitle1" data-cy="billing-reports-subtitle">
        {t('billingReportSubTitle')}
      </Typography>
      <BillingReportForm />
    </div>
  )
}

export default BillingReport
