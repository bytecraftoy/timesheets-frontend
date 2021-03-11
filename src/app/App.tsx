import React, { useContext, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { makeStyles } from '@material-ui/core/styles'
import TitleBar from '../navigation/TitleBar'
import SideBar from '../navigation/SideBar'
import Content from '../navigation/Content'
import Notification from '../toast/Notification'
import UserContext from '../context/UserContext'
import { UserContextType } from '../common/types'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}))

const App: React.FC = () => {
  const classes = useStyles()

  const [open, setOpen] = useState(true)
  const [context, setContext] = useState<UserContextType>(useContext(UserContext))

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <UserContext.Provider value={context}>
        <RecoilRoot>
          <Notification />
          <TitleBar open={open} handleDrawerOpen={handleDrawerOpen} setContext={setContext} />
          <Router>
            <SideBar open={open} handleDrawerClose={handleDrawerClose} />
            <Content />
          </Router>
        </RecoilRoot>
      </UserContext.Provider>
    </div>
  )
}

export default App
