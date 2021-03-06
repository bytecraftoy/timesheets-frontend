import React from 'react'
import { makeStyles, TableCell, TableRow } from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import { minutesToHoursAndMinutes } from '../services/dateAndTimeService'

const useStyles = makeStyles(() => ({
  subTitleRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
}))

const SummaryTotalRow: React.FC<{ label: string; total: number }> = ({ label, total }) => {
  const classes = useStyles()
  return (
    <TableRow className={classes.subTitleRow}>
      <TableCell />
      <TableCell align="right">{label}</TableCell>
      <TableCell colSpan={2} align="right">
        {minutesToHoursAndMinutes(total)}
      </TableCell>
    </TableRow>
  )
}

export default SummaryTotalRow
