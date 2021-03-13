import React, { useState } from 'react'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import { BillingReportData } from '../../common/types'
import { PATHS } from '../../common/constants'
import BillingReportForm from './BillingReportForm'
import BillingReportPreview from './BillingReportPreview'

const BillingReport: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  const [reportData, setReportData] = useState<BillingReportData | undefined>()

  return (
    <>
      <Typography variant="h2" data-cy="reports-title">
        {t('report.title')}
      </Typography>
      <Switch>
        <Route exact path={path}>
          <Typography variant="subtitle1" data-cy="billing-reports-subtitle">
            {t('report.billing.form.title')}
          </Typography>
          <BillingReportForm setReportData={setReportData} />
        </Route>
        <Route path={`${path}/preview`}>
          {!reportData && <Redirect to={PATHS.billingReport} />}
          {reportData && <BillingReportPreview data={reportData} />}
        </Route>
      </Switch>
    </>
  )
}

export default BillingReport
