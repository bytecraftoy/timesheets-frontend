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

const useStyles = makeStyles(() => ({
  collapseButtonCell: {
    width: '100px',
  },
}))

const ReportTableHead: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
}> = ({ open, setOpen, title }) => {
  const classes = useStyles()
  return (
    <TableHead>
      <TableRow>
        <TableCell colSpan={1} className={classes.collapseButtonCell}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={3} align="left">
          <Typography variant="h6">{title}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default ReportTableHead
