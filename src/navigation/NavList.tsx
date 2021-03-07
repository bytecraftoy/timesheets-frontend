import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import AssessmentIcon from '@material-ui/icons/Assessment'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { PATHS } from '../common/constants'
import useStyles from './styles'

// Navigation links in side bar menu go here.
const NavList: React.FC = () => {
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText data-cy="dashboard-nav" primary={t('dashboard.title')} />
      </ListItem>
      <ListItem button component={Link} to={PATHS.projects}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText data-testid="projects-nav" primary={t('project.title')} />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText data-cy="reports-nav" primary={t('report.title')} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button component={Link} to={PATHS.billingReport} className={classes.nested}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText data-cy="billing-reports-nav" primary="Billing" />
          </ListItem>
          <ListItem button component={Link} to={PATHS.salaryReport} className={classes.nested}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText data-cy="salary-reports-nav" primary="Salary" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  )
}

export default NavList
