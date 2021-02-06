import React from 'react'
import 'date-fns'
import { Grid } from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { DatePickerProps } from '../common/types'

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  label,
  value,
  handleDateChange,
  errors,
  touched,
}) => {
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
        error={Boolean(errors && touched)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </Grid>
  )
}

export default DatePicker
