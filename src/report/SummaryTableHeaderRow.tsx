import React from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { TableHeaderRowProps } from '../common/types'

const SummaryTableHeaderRow: React.FC<TableHeaderRowProps> = ({
  leftLabel,
  centerLabel,
  currency,
}) => {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle1">{leftLabel}</Typography>
        </TableCell>
        <TableCell>
          <Typography align="right" variant="subtitle1">
            {centerLabel}
          </Typography>
        </TableCell>
        <TableCell />
        <TableCell align="right">
          <Typography variant="subtitle1">{t('timeInput.label')}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="subtitle1">{t('report.preview.cost', { currency })}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default SummaryTableHeaderRow
