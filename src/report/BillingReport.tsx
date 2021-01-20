import React from 'react'
import 'date-fns'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { getFirstDayOfLastMonth, getLastDayOfLastMonth } from './ReportService'
import DatePicker from './DatePicker'

const BillingReport: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Date | null>(getFirstDayOfLastMonth)
  const [endDate, setEndDate] = React.useState<Date | null>(getLastDayOfLastMonth)

  return (
    <div>
      <p>Reports</p>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-evenly">
          <DatePicker
            id="start-date-picker"
            label="Start date"
            selectedDate={startDate}
            handleDateChange={(date) => setStartDate(date)}
          />
          <DatePicker
            id="end-date-picker"
            label="End date"
            selectedDate={endDate}
            handleDateChange={(date) => setEndDate(date)}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  )
}

export default BillingReport
