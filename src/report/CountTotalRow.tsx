import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'

const CountTotalRow: React.FC<{ className?: string; label: string; total: string }> = ({
  className,
  label,
  total,
}) => {
  return (
    <TableRow className={className}>
      <TableCell colSpan={2} />
      <TableCell align="right">
        <strong>{label}</strong>
      </TableCell>
      <TableCell align="right">
        <strong>{total}</strong>
      </TableCell>
    </TableRow>
  )
}

export default CountTotalRow
