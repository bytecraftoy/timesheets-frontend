import React from 'react'
import 'date-fns'
import { Grid } from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'

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

export default DatePicker
