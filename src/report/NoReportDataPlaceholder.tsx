import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from '@material-ui/core'

const NoReportDataPlaceHolder: React.FC<{ linkTo: string }> = ({ linkTo }) => {
  const { t } = useTranslation()
  return (
    <>
      <Typography variant="subtitle1">{t('report.noReport')}</Typography>
      <Button variant="outlined" color="primary" component={Link} to={linkTo}>
        {t('report.generate')}
      </Button>
    </>
  )
}

export default NoReportDataPlaceHolder
