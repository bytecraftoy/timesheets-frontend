import React, { useState } from 'react'
import clsx from 'clsx'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RecoilRoot, useRecoilValue } from 'recoil'

import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  AppBar,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AssessmentIcon from '@material-ui/icons/Assessment'
import MenuIcon from '@material-ui/icons/Menu'
import SalaryReport from '../report/salaryReport/SalaryReport'
import ProjectsView from '../project/Projects'
import BillingReport from '../report/billingReport/BillingReport'
import Dashboard from '../dashboard/Dashboard'
import notificationState from '../common/atoms'
import Toast from '../toast/Toast'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  fixedHeight: {
    height: theme.spacing(30),
  },
  menuButton: {
    marginRight: theme.spacing(4.5),
  },
  menuButtonHidden: {
    display: 'none',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: theme.spacing(3), // keep right padding when drawer closed
  },
  title: {
    flexGrow: 1,
  },
  toolbarIcon: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const PATHS = {
  projects: '/projects',
  billingReport: '/reports/billing',
  salaryReport: '/reports/salary',
}

const TitleBar: React.FC<{ open: boolean; handleDrawerOpen: () => void }> = ({
  open,
  handleDrawerOpen,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          data-cy="open-menudrawer-button"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title} data-cy="app-title">
          {t('app.title')}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

// Navigation links in side bar menu go here.
const NavList: React.FC = () => {
  const [open, setOpen] = React.useState(false)
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

const SideBar: React.FC<{ open: boolean; handleDrawerClose: () => void }> = ({
  open,
  handleDrawerClose,
}) => {
  const classes = useStyles()
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose} data-cy="close-menudrawer-button">
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <NavList />
    </Drawer>
  )
}

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
            <Dashboard />
          </Route>
        </Switch>
      </Container>
    </main>
  )
}

const Notification: React.FC = () => {
  const notification = useRecoilValue(notificationState)

  return <>{notification.message && <Toast />}</>
}

const App: React.FC = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  return (
    <div className={classes.root}>
      <RecoilRoot>
        <Notification />
        <TitleBar open={open} handleDrawerOpen={handleDrawerOpen} />
        <Router>
          <SideBar open={open} handleDrawerClose={handleDrawerClose} />
          <Content />
        </Router>
      </RecoilRoot>
    </div>
  )
}

export default App
