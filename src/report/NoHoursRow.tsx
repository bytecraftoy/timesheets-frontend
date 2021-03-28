import React from 'react'
import { TableCell, TableRow } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import useStyles from './styles'

const NoHoursRow: React.FC<{ numberOfIndent: number }> = ({ numberOfIndent }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <TableRow className={classes.stripedRow}>
      <TableCell />
      {numberOfIndent === 2 && <TableCell />}
      <TableCell align="center" colSpan={numberOfIndent === 2 ? 2 : 3}>
        {t('report.preview.noHours')}
      </TableCell>
    </TableRow>
  )
}

export default NoHoursRow
