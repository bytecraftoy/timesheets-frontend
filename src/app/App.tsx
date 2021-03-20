import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { makeStyles } from '@material-ui/core/styles'
import TitleBar from '../navigation/TitleBar'
import SideBar from '../navigation/SideBar'
import Content from '../navigation/Content'
import Notification from '../toast/Notification'
import { UserProvider } from '../context/UserContext'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}))

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
