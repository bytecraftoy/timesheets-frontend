import React from 'react'
import 'date-fns'
import { useTranslation } from 'react-i18next'
import DateFnsUtils from '@date-io/date-fns'
import { Grid } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { TimeIntervalSelectsProps } from '../common/types'
import DatePicker from './DatePicker'
import * as constants from '../common/constants'
import DateErrors from './DateErrors'

const TimeIntervalSelects: React.FC<TimeIntervalSelectsProps> = ({
  values,
  setFieldValue,
  errors,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Grid container item spacing={6}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            id="start-date-picker"
            label={t('startDate.label')}
            value={values.startDate}
            handleDateChange={(date) => {
              setFieldValue(constants.START_DATE, date)
            }}
            errors={errors.startDate}
          />
          <DatePicker
            id="end-date-picker"
            label={t('endDate.label')}
            value={values.endDate}
            handleDateChange={(date) => {
              setFieldValue(constants.END_DATE, date)
            }}
            errors={errors.endDate}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      {(errors.startDate || errors.endDate) && <DateErrors errors={errors} />}
    </>
  )
}

export default TimeIntervalSelects
