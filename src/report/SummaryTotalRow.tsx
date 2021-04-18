import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'
import { minutesToHoursAndMinutes } from '../services/dateAndTimeService'

const SummaryTotalRow: React.FC<{
  label: string
  totalTime: number
  totalCost: number
  className: string
}> = ({ label, totalTime, totalCost, className }) => {
  return (
    <TableRow className={className}>
      <TableCell />
      <TableCell align="right">{label}</TableCell>
      <TableCell colSpan={2} align="right">
        {minutesToHoursAndMinutes(totalTime)}
      </TableCell>
      <TableCell align="right">{totalCost}</TableCell>
    </TableRow>
  )
}

export default SummaryTotalRow
