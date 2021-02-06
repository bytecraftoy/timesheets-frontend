import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormikErrors } from 'formik'
import { Button, Grid } from '@material-ui/core'
import { BillingReportFormValues } from '../common/types'
import {
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
} from './ReportService'

interface PickTimeframeButtonProps {
  label: string
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PickTimeframeButton: React.FC<PickTimeframeButtonProps> = ({ label, handleClick }) => {
  return (
    <Grid item>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        {label}
      </Button>
    </Grid>
  )
}

interface TimeIntervalQuickSelectsProps {
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<BillingReportFormValues>>
}

const TimeIntervalQuickSelects: React.FC<TimeIntervalQuickSelectsProps> = ({ setFieldValue }) => {
  const { t } = useTranslation()

  return (
    <Grid container item direction="row" spacing={1}>
      <PickTimeframeButton
        label={t('button.lastMonth')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfMonth(1))
          setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        }}
      />
      <PickTimeframeButton
        label={t('button.lastTwoMonths')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfMonth(2))
          setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        }}
      />
      <PickTimeframeButton
        label={t('button.lastSixMonths')}
        handleClick={() => {
          setFieldValue(t('startDate.name'), getFirstDayOfMonth(6))
          setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
        }}
      />
      <PickTimeframeButton
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
