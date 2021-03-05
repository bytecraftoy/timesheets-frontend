import React from 'react'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import {
  IconButton,
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',
  },
  collapseButtonCell: {
    width: theme.spacing(3),
  },
  tableHeaderRow: {
    backgroundColor: indigo[400],
    color: theme.palette.common.white,
  },
}))

const ReportTableTitle: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
}> = ({ open, setOpen, title }) => {
  const classes = useStyles()
  return (
    <TableHead>
      <TableRow className={classes.tableHeaderRow}>
        <TableCell colSpan={1} className={classes.collapseButtonCell}>
          <IconButton
            classes={{ root: classes.root }}
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={3} align="center">
          <Typography classes={{ root: classes.root }} variant="h6">
            {title}
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default ReportTableTitle
