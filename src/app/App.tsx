import React from 'react'
import clsx from 'clsx'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RecoilRoot, useRecoilValue } from 'recoil'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import {
  AppBar,
  Container,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DashboardIcon from '@material-ui/icons/Dashboard'
import MenuIcon from '@material-ui/icons/Menu'

import ProjectsView from '../project/Projects'
import Dashboard from '../dashboard/Dashboard'
import notificationState from '../common/atoms'
import Toast from '../toast/Toast'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      height: 240,
    },
    menuButton: {
      marginRight: 36,
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
      paddingRight: 24, // keep right padding when drawer closed
    },
    title: {
      flexGrow: 1,
    },
    toolbarIcon: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
  })
)

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
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {t('appTitle')}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

// Navigation links in side bar menu go here.
const NavList: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div>
      <ListItem button component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/projects">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary={t('projectsTitle')} />
      </ListItem>
    </div>
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
        <IconButton onClick={handleDrawerClose}>
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
          <Route path="/projects">
            <ProjectsView />
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
  const [open, setOpen] = React.useState(true)
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
