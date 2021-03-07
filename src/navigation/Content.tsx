import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { DEBOUNCEMS, PATHS } from '../common/constants'
import SalaryReport from '../report/salaryReport/SalaryReport'
import ProjectsView from '../project/Projects'
import BillingReport from '../report/billingReport/BillingReport'
import Dashboard from '../dashboard/Dashboard'
import useStyles from './styles'

// Routes to different content go here inside Switch component.
const Content: React.FC = () => {
  const classes = useStyles()

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Switch>
          <Route path={PATHS.projects}>
            <ProjectsView />
          </Route>
          <Route path={PATHS.billingReport}>
            <BillingReport />
          </Route>
          <Route path={PATHS.salaryReport}>
            <SalaryReport />
          </Route>
          <Route path="/">
            <Dashboard debounceMs={DEBOUNCEMS} />
          </Route>
        </Switch>
      </Container>
    </main>
  )
}
export default Content
