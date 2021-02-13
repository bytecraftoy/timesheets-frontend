import React from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

interface TableHeaderRowProps {
  leftLabel: string
  centerLabel: string
}

const SummaryTableHeaderRow: React.FC<TableHeaderRowProps> = ({ leftLabel, centerLabel }) => {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle1">{leftLabel}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1">{centerLabel}</Typography>
        </TableCell>
        <TableCell />
        <TableCell align="right">
          <Typography variant="subtitle1">{t('timeInput.label')}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default SummaryTableHeaderRow
