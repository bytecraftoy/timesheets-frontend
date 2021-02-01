import React, { useState } from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@material-ui/core'
import { BillingReportData } from '../common/types'
import BillingReportForm from './BillingReportForm'
import BillingReportPreview from './BillingReportPreview'

const NoReportDataPlaceHolder = () => {
  const { t } = useTranslation()
  return (
    <>
      <Typography variant="subtitle1">{t('report.noReport')}</Typography>
      <Button variant="outlined" color="primary" component={Link} to="/reports">
        {t('report.generate')}
      </Button>
    </>
  )
}

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
          {!reportData && <NoReportDataPlaceHolder />}
          {reportData && <BillingReportPreview data={reportData} />}
        </Route>
      </Switch>
    </>
  )
}

export default BillingReport
