import React from 'react'
import { FormHelperText, Grid, makeStyles } from '@material-ui/core'
import { DateErrorProps, DateErrorsProps } from '../common/types'

const useStyles = makeStyles((theme) => ({
  dateErrorText: {
    width: theme.spacing(33.75),
  },
}))

const DateError: React.FC<DateErrorProps> = ({ errors }) => {
  const classes = useStyles()

  return (
    <Grid item className={classes.dateErrorText}>
      {errors && <FormHelperText>{errors}</FormHelperText>}
    </Grid>
  )
}

const DateErrors: React.FC<DateErrorsProps> = ({ errors }) => {
  return (
    <Grid container item spacing={6}>
      <DateError errors={errors.startDate} />
      <DateError errors={errors.endDate} />
    </Grid>
  )
}

export default DateErrors
