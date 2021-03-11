import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import useStyles from './styles'
import { UserContextType } from '../common/types'
import UserContextSelect from '../context/UserContextSelect'

const TitleBar: React.FC<{
  open: boolean
  handleDrawerOpen: () => void
  setContext: React.Dispatch<React.SetStateAction<UserContextType>>
}> = ({ open, handleDrawerOpen, setContext }) => {
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
        <UserContextSelect setContext={setContext} />
      </Toolbar>
    </AppBar>
  )
}

export default TitleBar
