import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, makeStyles } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { FormikSetFieldValue } from '../common/types'
import {
  getFirstDayOfMonth,
  getLastDayOfThisMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
} from '../services/dateAndTimeService'

const THIS_MONTH = 'thisMonth'
const LAST_MONTH = 'lastMonth'
const LAST_TWO_MONTHS = 'lastTwoMonths'
const LAST_SIX_MONTHS = 'lastSixMonths'
const LAST_YEAR = 'lastYear'

const useStyles = makeStyles({
  root: {
    borderColor: 'rgba(63, 81, 181, 0.5)',
    color: '#3f51b5',
    padding: '5px 15px',
    '&:hover': {
      border: '1px solid #3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.04)',
    },
    '&$selected': {
      color: '#fff',
      backgroundColor: 'rgba(63, 81, 181, 0.9)',
      '&:hover': {
        backgroundColor: 'rgba(48, 63, 159, 0.9)',
      },
    },
  },
  selected: {},
})

const TimeIntervalQuickSelects: React.FC<FormikSetFieldValue> = ({ setFieldValue }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [timeInterval, setTimeInterval] = useState<string | null>(LAST_MONTH)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFieldValueWithTimeout = (field: string, value: any) => {
    // Using setTimeout() is a temporary fix for validation issue when calling setFieldValue multiple times consecutively
    // See here: https://github.com/formium/formik/issues/2266
    setTimeout(() => {
      setFieldValue(field, value)
    }, 0)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>, newTimeInterval: string | null) => {
    if (newTimeInterval !== null) {
      setTimeInterval(newTimeInterval)
    }

    switch (newTimeInterval) {
      case THIS_MONTH:
        setFieldValueWithTimeout(t('startDate.name'), getFirstDayOfMonth(0))
        setFieldValueWithTimeout(t('endDate.name'), getLastDayOfThisMonth())
        break
      case LAST_MONTH:
        setFieldValueWithTimeout(t('startDate.name'), getFirstDayOfMonth(1))
        setFieldValueWithTimeout(t('endDate.name'), getLastDayOfLastMonth())
        break
      case LAST_TWO_MONTHS:
        setFieldValueWithTimeout(t('startDate.name'), getFirstDayOfMonth(2))
        setFieldValueWithTimeout(t('endDate.name'), getLastDayOfLastMonth())
        break
      case LAST_SIX_MONTHS:
        setFieldValueWithTimeout(t('startDate.name'), getFirstDayOfMonth(6))
        setFieldValueWithTimeout(t('endDate.name'), getLastDayOfLastMonth())
        break
      case LAST_YEAR:
        setFieldValueWithTimeout(t('startDate.name'), getFirstDayOfLastYear())
        setFieldValueWithTimeout(t('endDate.name'), getLastDayOfLastYear())
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
        <ToggleButton
          classes={{ root: classes.root, selected: classes.selected }}
          aria-label={t('button.thisMonth')}
          value={THIS_MONTH}
        >
          {t('button.thisMonth')}
        </ToggleButton>
        <ToggleButton
          classes={{ root: classes.root, selected: classes.selected }}
          aria-label={t('button.lastMonth')}
          value={LAST_MONTH}
        >
          {t('button.lastMonth')}
        </ToggleButton>
        <ToggleButton
          classes={{ root: classes.root, selected: classes.selected }}
          aria-label={t('button.lastTwoMonths')}
          value={LAST_TWO_MONTHS}
        >
          {t('button.lastTwoMonths')}
        </ToggleButton>
        <ToggleButton
          classes={{ root: classes.root, selected: classes.selected }}
          aria-label={t('button.lastSixMonths')}
          value={LAST_SIX_MONTHS}
        >
          {t('button.lastSixMonths')}
        </ToggleButton>
        <ToggleButton
          classes={{ root: classes.root, selected: classes.selected }}
          aria-label={t('button.lastYear')}
          value={LAST_YEAR}
        >
          {t('button.lastYear')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  )
}

export default TimeIntervalQuickSelects
