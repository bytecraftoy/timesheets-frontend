import React from 'react'
import { makeStyles, TableCell, TableRow } from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'

const useStyles = makeStyles(() => ({
  employeeRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
}))

const NoHoursRow: React.FC<{ numberOfIndent: number }> = ({ numberOfIndent }) => {
  const classes = useStyles()

  return (
    <TableRow className={classes.employeeRow}>
      <TableCell />
      {numberOfIndent === 2 && <TableCell />}
      <TableCell colSpan={numberOfIndent === 2 ? 2 : 3}>No hours</TableCell>
    </TableRow>
  )
}

export default NoHoursRow
