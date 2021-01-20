import React from 'react'
import 'date-fns'
import { KeyboardDatePicker } from '@material-ui/pickers'

const DatePicker: React.FC<{
  id: string | undefined
  label: React.ReactNode
  selectedDate: Date | null
  handleDateChange: (date: Date | null, value?: string | null | undefined) => void
}> = ({ id, label, selectedDate, handleDateChange }) => {
  return (
    <KeyboardDatePicker
      disableToolbar
      variant="inline"
      format="dd.MM.yyyy"
      margin="normal"
      id={id}
      label={label}
      value={selectedDate}
      onChange={handleDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  )
}

export default DatePicker
