import React from 'react'
import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { TableHeaderRowProps } from '../common/types'

const DetailsTableHeaderRow: React.FC<TableHeaderRowProps> = ({ leftLabel, centerLabel }) => {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle1">{leftLabel}</Typography>
        </TableCell>
        <TableCell>
          <Typography align="center" variant="subtitle1">
            {centerLabel}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle1">{t('timeInput.label')}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default DetailsTableHeaderRow
