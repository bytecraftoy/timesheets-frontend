import { makeStyles, Theme } from '@material-ui/core/styles'
import { DRAWER_WIDTH } from '../common/constants'

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(4.5),
  },
  menuButtonHidden: {
    display: 'none',
  },
  root: {
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: theme.spacing(3), // keep right padding when drawer closed
  },
}))

export default useStyles
