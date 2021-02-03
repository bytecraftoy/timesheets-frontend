import React from 'react'
import 'date-fns'
import { useTranslation } from 'react-i18next'
import DateFnsUtils from '@date-io/date-fns'
import { Grid } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { FormikErrors } from 'formik'
import { BillingReportFormValues } from '../common/types'

interface DatePickerProps {
  id: string | undefined
  label: React.ReactNode
  value: Date | null
  handleDateChange: (date: Date | null, value?: string | null | undefined) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ id, label, value, handleDateChange }) => {
  return (
    <Grid item>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="dd.MM.yyyy"
        margin="normal"
        id={id}
        label={label}
        value={value}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </Grid>
  )
}

interface TimeIntervalSelectsProps {
  values: BillingReportFormValues
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<BillingReportFormValues>>
}

const TimeIntervalSelects: React.FC<TimeIntervalSelectsProps> = ({ values, setFieldValue }) => {
  const { t } = useTranslation()

  return (
    <Grid container item spacing={6}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          id="start-date-picker"
          label={t('startDate.label')}
          value={values.startDate}
          handleDateChange={(date) => {
            setFieldValue(t('startDate.name'), date)
          }}
        />
        <DatePicker
          id="end-date-picker"
          label={t('endDate.label')}
          value={values.endDate}
          handleDateChange={(date) => {
            setFieldValue(t('endDate.name'), date)
          }}
        />
      </MuiPickersUtilsProvider>
    </Grid>
  )
}

export default TimeIntervalSelects
