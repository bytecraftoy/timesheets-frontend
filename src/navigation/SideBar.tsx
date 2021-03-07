import React from 'react'
import clsx from 'clsx'
import { Divider, Drawer, IconButton } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NavList from './NavList'

import useStyles from './styles'

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

export default SideBar
