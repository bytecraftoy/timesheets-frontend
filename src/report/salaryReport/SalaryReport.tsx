import React, { useState } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import { salaryReportData } from '../../testUtils/reportTestUtils'
import { SalaryReportData } from '../../common/types'
import NoReportDataPlaceHolder from '../NoReportDataPlaceholder'
import SalaryReportForm from './SalaryReportForm'
import SalaryReportPreview from './SalaryReportPreview'

const BillingReport: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()

  const [reportData, setReportData] = useState<SalaryReportData | undefined>(salaryReportData)

  return (
    <>
      <Typography variant="h2" data-cy="reports-title">
        {t('report.title')}
      </Typography>
      <Switch>
        <Route exact path={path}>
          <Typography variant="subtitle1" data-cy="salary-reports-subtitle">
            {t('report.salary.form.title')}
          </Typography>
          <SalaryReportForm setReportData={setReportData} />
        </Route>
        <Route path={`${path}/preview`}>
          {!reportData && <NoReportDataPlaceHolder linkTo="reports/salary" />}
          {reportData && <SalaryReportPreview data={reportData} />}
        </Route>
      </Switch>
    </>
  )
}

export default BillingReport