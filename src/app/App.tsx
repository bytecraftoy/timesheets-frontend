import React, { useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RecoilRoot } from 'recoil'
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import SideBar from '../navigation/SideBar'
import Content from '../navigation/Content'
import Notification from '../toast/Notification'
import { UserProvider } from '../context/UserContext'
import UserContextSelect from '../context/UserContextSelect'
import useStyles from './styles'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HOST
axios.defaults.timeout = 10000

const TitleBar: React.FC<{
  open: boolean
  handleDrawerOpen: () => void
}> = ({ open, handleDrawerOpen }) => {
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
        <UserContextSelect />
      </Toolbar>
    </AppBar>
  )
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
      <UserProvider>
        <RecoilRoot>
          <Notification />
          <TitleBar open={open} handleDrawerOpen={handleDrawerOpen} />
          <Router>
            <SideBar open={open} handleDrawerClose={handleDrawerClose} />
            <Content />
          </Router>
        </RecoilRoot>
      </UserProvider>
    </div>
  )
}

export default App
