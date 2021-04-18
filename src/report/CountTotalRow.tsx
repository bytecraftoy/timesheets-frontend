import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'

const CountTotalRow: React.FC<{
  className?: string
  label: string
  totalTime: string
  totalCost: number
}> = ({ className, label, totalTime, totalCost }) => {
  return (
    <TableRow className={className}>
      <TableCell colSpan={2} />
      <TableCell align="right">
        <strong>{label}</strong>
      </TableCell>
      <TableCell align="right">
        <strong>{totalTime}</strong>
      </TableCell>
      <TableCell align="right">
        <strong>{totalCost}</strong>
      </TableCell>
    </TableRow>
  )
}

export default CountTotalRow
