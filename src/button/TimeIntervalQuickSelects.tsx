import React from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'
import { FormikSetFieldValue } from '../common/types'
import {
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
} from '../services/dateAndTimeService'
import OutlinedButton from './OutlinedButton'

const TimeIntervalQuickSelects: React.FC<FormikSetFieldValue> = ({ setFieldValue }) => {
  const { t } = useTranslation()

  return (
    <Grid container item direction="row" spacing={1}>
      <OutlinedButton
        label={t('button.lastMonth')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfMonth(1))
          setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        }}
      />
      <OutlinedButton
        label={t('button.lastTwoMonths')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfMonth(2))
          setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        }}
      />
      <OutlinedButton
        label={t('button.lastSixMonths')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfMonth(6))
          setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        }}
      />
      <OutlinedButton
        label={t('button.lastYear')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfLastYear())
          setFieldValue(t('endDate.name'), getLastDayOfLastYear())
        }}
      />
    </Grid>
  )
}

export default TimeIntervalQuickSelects
