import React from 'react'
import { makeStyles, TableCell, TableRow } from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import {
  formatDateFromStringWithWeekday,
  minutesToHoursAndMinutes,
} from '../services/dateAndTimeService'
import { TimeInput } from '../common/types'

const useStyles = makeStyles(() => ({
  timeInputRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
}))

const TimeInputRow: React.FC<{ timeInput: TimeInput }> = ({ timeInput }) => {
  const classes = useStyles()

  return (
    <TableRow className={classes.timeInputRow}>
      <TableCell />
      <TableCell align="right">{formatDateFromStringWithWeekday(timeInput.date)}</TableCell>
      <TableCell align="center">{minutesToHoursAndMinutes(timeInput.input)}</TableCell>
      <TableCell>{timeInput.description}</TableCell>
    </TableRow>
  )
}

export default TimeInputRow
