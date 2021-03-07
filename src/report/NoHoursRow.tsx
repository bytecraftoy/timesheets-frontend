import React from 'react'
import { makeStyles, TableCell, TableRow } from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() => ({
  employeeRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
}))

const NoHoursRow: React.FC<{ numberOfIndent: number }> = ({ numberOfIndent }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <TableRow className={classes.employeeRow}>
      <TableCell />
      {numberOfIndent === 2 && <TableCell />}
      <TableCell align="center" colSpan={numberOfIndent === 2 ? 2 : 3}>
        {t('report.preview.noHours')}
      </TableCell>
    </TableRow>
  )
}

export default NoHoursRow
