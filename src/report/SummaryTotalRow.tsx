import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'
import { minutesToHoursAndMinutes } from '../services/dateAndTimeService'

const SummaryTotalRow: React.FC<{ label: string; total: number; className: string }> = ({
  label,
  total,
  className,
}) => {
  return (
    <TableRow className={className}>
      <TableCell />
      <TableCell align="right">{label}</TableCell>
      <TableCell colSpan={2} align="right">
        {minutesToHoursAndMinutes(total)}
      </TableCell>
    </TableRow>
  )
}

export default SummaryTotalRow
