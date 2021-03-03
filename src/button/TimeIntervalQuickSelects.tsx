import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { FormikSetFieldValue } from '../common/types'
import {
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
} from '../services/dateAndTimeService'

// const THIS_MONTH = 'thisMonth'
const LAST_MONTH = 'lastMonth'
const LAST_TWO_MONTHS = 'lastTwoMonths'
const LAST_SIX_MONTHS = 'lastSixMonths'
const LAST_YEAR = 'lastYear'

const TimeIntervalQuickSelects: React.FC<FormikSetFieldValue> = ({ setFieldValue }) => {
  const { t } = useTranslation()
  const [timeInterval, setTimeInterval] = useState<string | null>(LAST_MONTH)

  const handleClick = (event: React.MouseEvent<HTMLElement>, newTimeInterval: string | null) => {
    if (newTimeInterval !== null) {
      setTimeInterval(newTimeInterval)
    }

    switch (newTimeInterval) {
      case LAST_MONTH:
        setFieldValue(t('startDate.name'), getFirstDayOfMonth(1))
        setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        break
      case LAST_TWO_MONTHS:
        setFieldValue(t('startDate.name'), getFirstDayOfMonth(2))
        setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        break
      case LAST_SIX_MONTHS:
        setFieldValue(t('startDate.name'), getFirstDayOfMonth(6))
        setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        break
      case LAST_YEAR:
        setFieldValue(t('startDate.name'), getFirstDayOfLastYear())
        setFieldValue(t('endDate.name'), getLastDayOfLastYear())
        break
      default:
    }
  }

  return (
    <Grid container item direction="row" spacing={1}>
      <ToggleButtonGroup
        value={timeInterval}
        exclusive
        onChange={handleClick}
        aria-label="text alignment"
      >
        <ToggleButton aria-label={t('button.lastMonth')} value={LAST_MONTH}>
          {t('button.lastMonth')}
        </ToggleButton>
        <ToggleButton aria-label={t('button.lastTwoMonths')} value={LAST_TWO_MONTHS}>
          {t('button.lastTwoMonths')}
        </ToggleButton>
        <ToggleButton aria-label={t('button.lastSixMonths')} value={LAST_SIX_MONTHS}>
          {t('button.lastSixMonths')}
        </ToggleButton>
        <ToggleButton aria-label={t('button.lastYear')} value={LAST_YEAR}>
          {t('button.lastYear')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  )
}

export default TimeIntervalQuickSelects
