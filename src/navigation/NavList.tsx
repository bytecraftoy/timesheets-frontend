import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import AssessmentIcon from '@material-ui/icons/Assessment'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { PATHS } from '../common/constants'
import useStyles from './styles'
import NavListItem from './NavListItem'
import { useUserContext } from '../context/UserContext'

// Navigation links in side bar menu go here.
const NavList: React.FC = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const { user } = useUserContext()

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <List>
      <NavListItem
        linkTo="/"
        icon={<DashboardIcon />}
        testId="dashboard-nav"
        label={t('dashboard.title')}
      />
      <NavListItem
        linkTo={PATHS.projects}
        icon={<DashboardIcon />}
        testId="projects-nav"
        label={user.isManager ? t('project.title') : t('project.myProjectsLabel')}
      />
      {!user.isManager && (
        <NavListItem
          linkTo={PATHS.salaryReport}
          icon={<AssessmentIcon />}
          testId="salary-reports-nav"
          label={t('report.salary.mySalaryReportLabel')}
        />
      )}
      {user.isManager && (
        <>
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText data-cy="reports-nav" primary={t('report.title')} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NavListItem
                linkTo={PATHS.billingReport}
                icon={<AssessmentIcon />}
                testId="billing-reports-nav"
                label={t('report.billing.label')}
                className={classes.nested}
              />
              <NavListItem
                linkTo={PATHS.salaryReport}
                icon={<AssessmentIcon />}
                testId="salary-reports-nav"
                label={t('report.salary.label')}
                className={classes.nested}
              />
            </List>
          </Collapse>
        </>
      )}
    </List>
  )
}

export default NavList
