import { makeStyles, Theme } from '@material-ui/core/styles'
import { indigo } from '@material-ui/core/colors'
import * as constants from '../common/constants'

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  collapseButtonCell: {
    width: theme.spacing(3),
  },
  detailsTable: {
    marginTop: theme.spacing(5),
  },
  darkerRow: {
    backgroundColor: indigo[100],
  },
  errorText: {
    marginLeft: theme.spacing(1.5),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: constants.DRAWER_WIDTH,
  },
  root: {
    color: '#fff',
  },
  stripedRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
  tableHeaderRow: {
    backgroundColor: indigo[400],
    color: theme.palette.common.white,
  },
}))

export default useStyles
